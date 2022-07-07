"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRealtimeEnvUrl = exports.getCookie = exports.setCookie = exports.checkRequired = exports.getParamValue = exports.normalizeUrl = exports.removeTrailingSlash = void 0;
const ClientError_1 = require("./ClientError");
/**
 * Removes trailing slash character from input url string.
 * @export
 * @param {string} url  The url string to revove trailing slach
 * @returns Trailed url string
 */
function removeTrailingSlash(url) {
    return url.replace(/\/$/, "");
}
exports.removeTrailingSlash = removeTrailingSlash;
/**
 * Normalizes the input url string by trimming spaces and removing any trailing slash character.
 * @export
 * @param {string} url The url string to normalize
 * @returns Normalized url string
 */
function normalizeUrl(url) {
    return removeTrailingSlash(url.trim());
}
exports.normalizeUrl = normalizeUrl;
/**
 * Retrieves the query string parameter value from the browser url.
 * @export
 * @param {string} paramName The name of the query string parameter
 * @returns {string | null} The value of the parameter if found in query string part of the url or null otherwise
 */
function getParamValue(paramName) {
    if (globalThis.window && paramName) {
        const url = globalThis.window.location.href;
        paramName = paramName.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&#]" + paramName + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return null;
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    return null;
}
exports.getParamValue = getParamValue;
/**
 * Checks whether the input field value is specified or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 * @throws Throws an exception if `fieldValue` is `null` or `undefined`. If `checkEmptyString=true`, throws an exception if string is empty.
 */
function checkRequired(fieldName, fieldValue, checkEmptyString = true) {
    if (fieldValue === null || fieldValue === undefined)
        throw new ClientError_1.ClientError("missing_required_value", `${fieldName} is a required parameter, cannot be left empty`);
    if (checkEmptyString &&
        (fieldValue === "" ||
            (typeof fieldValue === "string" && fieldValue.trim() === "")))
        throw new ClientError_1.ClientError("missing_required_value", `${fieldName} is a required parameter, cannot be left empty`);
}
exports.checkRequired = checkRequired;
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
function setCookie(req, res, name, value, maxAge, sameSite, httpOnly, secure) {
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
            res.setHeader("Set-Cookie", !currentCookies ? [cookieStr] : currentCookies.concat(cookieStr));
        }
    }
    else if (document) {
        document.cookie = cookieStr;
    }
}
exports.setCookie = setCookie;
/**
 * Gets the value of the cookie identified by its name.
 *
 * @param  {any} req Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
 * @param  {any} res Represents the HTTP response that an Express or Next.js app sends when it gets an HTTP request
 * @param  {any} name The name of the cookie to fetch
 * @returns {object} The value of the cookie object if found otherwise null
 */
function getCookie(req, res, name) {
    var _a;
    let cookies = {};
    // Check if it is client side or not, if the window object is not defined then we are at the server side
    if (typeof window === "undefined") {
        if (req && res) {
            // if cookie-parser is used in project get cookies from ctx.req.cookies
            // if cookie-parser isn't used in project get cookies from ctx.req.headers.cookie
            if (req.cookies)
                cookies = req.cookies;
            if ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie)
                cookies = parse(req.headers.cookie);
        }
    }
    else if (document) {
        const documentCookies = document.cookie ? document.cookie.split("; ") : [];
        for (const entry of documentCookies) {
            const cookieParts = entry.split("=");
            const cvalue = cookieParts.slice(1).join("=");
            const cname = cookieParts[0];
            cookies[cname] = cvalue;
        }
    }
    const cookieValue = decode(cookies[name]);
    if (cookieValue === "true")
        return true;
    if (cookieValue === "false")
        return false;
    if (cookieValue === "undefined")
        return undefined;
    if (cookieValue === "null")
        return null;
    return cookieValue;
}
exports.getCookie = getCookie;
/**
 * Converts the input value to string
 *
 * @param  {string} value The value to convert into string
 */
function stringify(value = "") {
    try {
        const result = JSON.stringify(value);
        return /^[\{\[]/.test(result) ? result : value;
    }
    catch (e) {
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
function serialize(name, val, options) {
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
function parse(str) {
    if (typeof str !== "string" || !str)
        return null;
    const obj = {};
    let index = 0;
    while (index < str.length) {
        const eqIdx = str.indexOf("=", index);
        // no more cookie pairs
        if (eqIdx === -1)
            break;
        let endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
            endIdx = str.length;
        }
        else if (endIdx < eqIdx) {
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
            }
            catch (e) {
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
function encode(val) {
    return encodeURIComponent(val);
}
/**
 * Decodes the input value.
 *
 * @param {string} val Value to encode
 * @returns {string} Encoded value
 */
function decode(val) {
    if (!val)
        return val;
    return val.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
}
/**
 * Parses the env url and returns its components
 *
 * @param {string} envUrl Environment url to parse
 * @returns {object} Parsed environment url components
 */
function parseRealtimeEnvUrl(envUrl) {
    // Get rid of http:// or https://
    let temp;
    let protocol;
    if (envUrl.startsWith("https://")) {
        temp = envUrl.replace("https://", "");
        protocol = "https://";
    }
    else {
        temp = envUrl.replace("http://", "");
        protocol = "http://";
    }
    // We have two types of environment urls
    // 1. subdomain.cluster.altogic.com or
    // 2. cluster.altogic.com/e:identifier
    // Lets get the items
    const items = temp.split(".");
    if (items.length === 4) {
        const info = { subdomain: "", realtimeUrl: "", envId: "" };
        info.subdomain = items[0];
        // Get the last item of the array
        const posIndex = items[3].indexOf("/");
        // If we have a '/' character we need to sanitize the last element
        if (posIndex !== -1) {
            items[3] = items[3].substring(0, posIndex);
        }
        // Override the subdomin entry
        items[0] = "realtime";
        info.realtimeUrl = protocol + items.join(".");
        return info;
    }
    if (items.length === 3) {
        // Get the last item of the array
        const posIndex = items[2].indexOf("/");
        // If we have a '/' character we need to sanitize the last element
        if (posIndex !== -1) {
            const info = { subdomain: "", realtimeUrl: "", envId: "" };
            const baseUrl = items[2].substring(posIndex);
            items[2] = items[2].substring(0, posIndex);
            if (items[0] === "engine")
                items[0] = "realtime";
            else
                items.unshift("realtime");
            info.realtimeUrl = protocol + items.join(".");
            if ((baseUrl && baseUrl.startsWith("/e:")) || baseUrl.startsWith("/E:")) {
                const segments = baseUrl.split("/");
                // At index 0 we have ''
                const envIdStr = segments[1];
                const segments2 = envIdStr.split(":");
                info.envId = segments2[1].trim();
            }
            return info;
        }
        else {
            // This means we have something like "cluster.altogic.com"
            items.unshift("realtime");
            return {
                subdomain: "",
                realtimeUrl: protocol + items.join("."),
                envId: "",
            };
        }
    }
    // Not a valid env url
    return { subdomain: "", realtimeUrl: "", envId: "" };
}
exports.parseRealtimeEnvUrl = parseRealtimeEnvUrl;
//# sourceMappingURL=helpers.js.map