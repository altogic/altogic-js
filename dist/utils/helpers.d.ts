/**
 * Removes trailing slash character from input url string.
 * @export
 * @param {string} url  The url string to revove trailing slach
 * @returns Trailed url string
 */
export declare function removeTrailingSlash(url: string): string;
/**
 * Normalizes the input url string by trimming spaces and removing any trailing slash character.
 * @export
 * @param {string} url The url string to normalize
 * @returns Normalized url string
 */
export declare function normalizeUrl(url: string): string;
/**
 * Retrieves the query string parameter value from the browser url.
 * @export
 * @param {string} paramName The name of the query string parameter
 * @returns {string | null} The value of the parameter if found in query string part of the url or null otherwise
 */
export declare function getParamValue(paramName: string): string | null;
/**
 * Checks whether the input field value is specified or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 * @throws Throws an exception if `fieldValue` is `null` or `undefined`. If `checkEmptyString=true`, throws an exception if string is empty.
 */
export declare function checkRequired(fieldName: string, fieldValue: any, checkEmptyString?: boolean): void;
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
export declare function setCookie(req: any, res: any, name: string, value: any, maxAge: number, sameSite: "strict" | "lax" | "none", httpOnly: boolean, secure: boolean): void;
/**
 * Gets the value of the cookie identified by its name.
 *
 * @param  {any} req Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
 * @param  {any} res Represents the HTTP response that an Express or Next.js app sends when it gets an HTTP request
 * @param  {any} name The name of the cookie to fetch
 * @returns {object} The value of the cookie object if found otherwise null
 */
export declare function getCookie(req: any, res: any, name: string): any;
/**
 * Parses the env url and returns its components
 *
 * @param {string} envUrl Environment url to parse
 * @returns {object} Parsed environment url components
 */
export declare function parseRealtimeEnvUrl(envUrl: string): any;
//# sourceMappingURL=helpers.d.ts.map