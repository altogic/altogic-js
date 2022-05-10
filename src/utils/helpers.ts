import { ClientError } from "./ClientError";
import { CookieOptions, KeyValuePair } from "../types";

/**
 * Removes trailing slash character from input url string.
 * @export
 * @param {string} url  The url string to revove trailing slach
 * @returns Trailed url string
 */
export function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

/**
 * Normalizes the input url string by trimming spaces and removing any trailing slash character.
 * @export
 * @param {string} url The url string to normalize
 * @returns Normalized url string
 */
export function normalizeUrl(url: string) {
  return removeTrailingSlash(url.trim());
}

/**
 * Retrieves the query string parameter value from the browser url.
 * @export
 * @param {string} paramName The name of the query string parameter
 * @returns {string | null} The value of the parameter if found in query string part of the url or null otherwise
 */
export function getParamValue(paramName: string): string | null {
  if (globalThis.window && paramName) {
    const url = globalThis.window.location.href;

    paramName = paramName.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&#]" + paramName + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  return null;
}

/**
 * Checks whether the input field value is specified or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 * @throws Throws an exception if `fieldValue` is `null` or `undefined`. If `checkEmptyString=true`, throws an exception if string is empty.
 */
export function checkRequired(
  fieldName: string,
  fieldValue: any,
  checkEmptyString: boolean = true
) {
  if (fieldValue === null || fieldValue === undefined)
    throw new ClientError(
      "missing_required_value",
      `${fieldName} is a required parameter, cannot be left empty`
    );

  if (
    checkEmptyString &&
    (fieldValue === "" ||
      (typeof fieldValue === "string" && fieldValue.trim() === ""))
  )
    throw new ClientError(
      "missing_required_value",
      `${fieldName} is a required parameter, cannot be left empty`
    );
}

/**
 * Sets the Set-Cookie HTTP response header to send a cookie from the server to the user agent, so that the user agent can send it back to the server later.
 *
 * @param  {any} req Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
 * @param  {any} res Represents the HTTP response that an Express or Next.js app sends when it gets an HTTP request
 * @param  {string} name Name of the cookie
 * @param  {any} value Value of the cookie
 * @param  {number} maxAge Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
 * @param  {string} sameSite Controls whether or not a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks. It takes three possible values: Strict, Lax, and None.
 * @param  {boolean} httpOnly Forbids JavaScript from accessing the cookie
 * @param  {boolean} secure Indicates that the cookie is sent to the server only when a request is made with the https: scheme (except on localhost), and therefore, is more resistant to man-in-the-middle attacks.
 */
export function setCookie(
  req: any,
  res: any,
  name: string,
  value: any,
  maxAge: number,
  sameSite: "strict" | "lax" | "none",
  httpOnly: boolean,
  secure: boolean
) {
  const cookieStr = serialize(name, stringify(value), {
    path: "/",
    maxAge,
    sameSite,
    httpOnly,
    secure,
  });

  // Check if it is client side or not, if the window object is not defined then we are not at the server side
  if (typeof window === "undefined") {
    if (req && res) {
      const currentCookies = res.getHeader("Set-Cookie");

      res.setHeader(
        "Set-Cookie",
        !currentCookies ? [cookieStr] : currentCookies.concat(cookieStr)
      );
    }
  } else if (document) {
    document.cookie = cookieStr;
  }
}

/**
 * Gets the value of the cookie identified by its name.
 *
 * @param  {any} req Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
 * @param  {any} res Represents the HTTP response that an Express or Next.js app sends when it gets an HTTP request
 * @param  {any} name The name of the cookie to fetch
 * @returns {object} The value of the cookie object if found otherwise null
 */
export function getCookie(req: any, res: any, name: string): any {
  let cookies: KeyValuePair = {};
  // Check if it is client side or not, if the window object is not defined then we are at the server side
  if (typeof window === "undefined") {
    if (req && res) {
      // if cookie-parser is used in project get cookies from ctx.req.cookies
      // if cookie-parser isn't used in project get cookies from ctx.req.headers.cookie
      if (req.cookies) cookies = req.cookies;
      if (req.headers?.cookie) cookies = parse(req.headers.cookie);
    }
  } else if (document) {
    const documentCookies = document.cookie ? document.cookie.split("; ") : [];
    for (const entry of documentCookies) {
      const cookieParts = entry.split("=");
      const cvalue = cookieParts.slice(1).join("=");
      const cname = cookieParts[0];

      cookies[cname] = cvalue;
    }
  }

  const cookieValue = decode(cookies[name]);

  if (cookieValue === "true") return true;
  if (cookieValue === "false") return false;
  if (cookieValue === "undefined") return undefined;
  if (cookieValue === "null") return null;

  return cookieValue;
}

/**
 * Converts the input value to string
 *
 * @param  {string} value The value to convert into string
 */
function stringify(value: string = "") {
  try {
    const result = JSON.stringify(value);
    return /^[\{\[]/.test(result) ? result : value;
  } catch (e) {
    return value;
  }
}

/**
 * Serialize the a name value pair into a cookie string suitable for http headers. An optional options object specifies additional cookie parameters.
 *
 * @param {string} name The name of the cookie
 * @param {string} val  The value of the cookie
 * @param {CookieOptions} options Additional cookie potions
 * @return {string} The serialized cookie header
 */

function serialize(name: string, val: string, options: CookieOptions): string {
  let str = name + "=" + encode(val);

  str += "; Max-Age=" + Math.floor(options.maxAge);
  str += "; Path=" + options.path;

  if (options.httpOnly) {
    str += "; HttpOnly";
  }

  if (options.secure) {
    str += "; Secure";
  }

  switch (options.sameSite) {
    case "lax":
      str += "; SameSite=Lax";
      break;
    case "strict":
      str += "; SameSite=Strict";
      break;
    case "none":
      str += "; SameSite=None";
      break;
    default:
      break;
  }

  return str;
}

/**
 *  Parse the given cookie header string into an object. The object has the various cookies as keys(names) => values.
 *
 * @param {string} str The cookie string to parse
 * @return {object} The parsed cookie object
 * @public
 */

function parse(str: string): any {
  if (typeof str !== "string" || !str) return null;

  const obj: any = {};
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    // no more cookie pairs
    if (eqIdx === -1) break;

    let endIdx = str.indexOf(";", index);

    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }

    const key = str.slice(index, eqIdx).trim();

    // only assign once
    if (undefined === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1);
      }

      try {
        obj[key] = decode(val);
      } catch (e) {
        obj[key] = val;
      }
    }

    index = endIdx + 1;
  }

  return obj;
}

/**
 * URL-encodes the input value.
 *
 * @param {string} val Value to encode
 * @returns {string} Encoded value
 */

function encode(val: string): string {
  return encodeURIComponent(val);
}

/**
 * Decodes the input value.
 *
 * @param {string} val Value to encode
 * @returns {string} Encoded value
 */

function decode(val: string): string {
  if (!val) return val;
  return val.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
}
