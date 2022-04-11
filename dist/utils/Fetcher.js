"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Fetcher_instances, _Fetcher_handleRequest;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const ClientError_1 = require("./ClientError");
const INVALID_SESSION_TOKEN = "invalid_session_token";
const MISSING_SESSION_TOKEN = "missing_session_token";
/**
 * HTTP client for the browser, Node or React Native. Created by {@link AltogicClient} during initialization. The client library uses [cross-fetch](https://www.npmjs.com/package/cross-fetch) under the hood to make requests to you app's execution environment.
 *
 * When creating the client if `apiKey` is specified in {@link ClientOptions}, Fetcher adds the provided apiKey to an **Authorization** header and sends it in all RESTful API requests to your backend app.
 *
 * Similarly, if there is an active user session, Fetcher also adds the session token to a **Session** header and sends it in all RESTful API requests to your backend app.
 * @export
 * @class Fetcher
 */
class Fetcher {
    /**
     * Creates an instance of Fetcher.
     * @param {string} restUrl The base URL that will be prepended to all RESTful API calls
     * @param {KeyValuePair} headers The default headers that will be sent in each RESTful API request to the app's execution environment
     */
    constructor(apiClient, restUrl, headers) {
        _Fetcher_instances.add(this);
        this.apiClient = apiClient;
        this.restUrl = restUrl;
        this.headers = headers;
        this.session = null;
    }
    /**
     * Makes a GET request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    get(path, query = {}, headers = {}, resolveType = "json") {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Fetcher_instances, "m", _Fetcher_handleRequest).call(this, "GET", path, query, headers, null, resolveType);
        });
    }
    /**
     * Makes a POST request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    post(path, body = null, query = {}, headers = {}, resolveType = "json") {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Fetcher_instances, "m", _Fetcher_handleRequest).call(this, "POST", path, query, headers, body, resolveType);
        });
    }
    /**
     * Makes a PUT request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    put(path, body = null, query = {}, headers = {}, resolveType = "json") {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Fetcher_instances, "m", _Fetcher_handleRequest).call(this, "PUT", path, query, headers, body, resolveType);
        });
    }
    /**
     * Makes a DELETE request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    delete(path, body = null, query = {}, headers = {}, resolveType = "json") {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Fetcher_instances, "m", _Fetcher_handleRequest).call(this, "DELETE", path, query, headers, body, resolveType);
        });
    }
    /**
     * Sets the session of the user that will be used by Fetcher. Adds the new session token to the **Session** request header.
     * @param  {Session} session Session info object
     * @returns void
     */
    setSession(session) {
        if (session && session.token) {
            this.session = session;
            this.headers.Session = session.token;
        }
    }
    /**
     * Clears the session info of the user from the Fetcher. Basically removes the **Session** header from the default request headers until a new session value is provided.
     * @returns void
     */
    clearSession() {
        this.session = null;
        delete this.headers.Session;
    }
    /**
     * Returns the api base url string.
     * @returns string
     */
    getBaseUrl() {
        return this.restUrl;
    }
    /**
     *
     * @param path
     * @param body
     * @param query
     * @param headers
     * @param progressCallback
     * @returns
     */
    /**
     * Uploads a file using `XMLHttpRequest` object instead of fetcher in order to track upload progress and call a callback function.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {any} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {any} progressCallback Callback function that will be called during file upload to inform the progres
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then a *single JSON object* providing information about the uploaded file is returned and the *errors* object is marked as `null`.
     */
    upload(path, body, query = {}, headers = {}, progressCallback = null) {
        return new Promise((resolve, reject) => {
            // Check the path format
            if (!path || !path.trim().startsWith("/"))
                throw new ClientError_1.ClientError("invalid_request_path", "A valid request path with a leading slash '/' needs to be specified e.g., /path");
            // Get the body of the request in the right format
            let requestBody;
            // Check if the input body is a FormData object or not. If the client api is used in a Node.js environment
            // we will not have the FormData object by default
            if (typeof FormData !== "undefined" && body instanceof FormData) {
                requestBody = body;
            }
            else {
                requestBody = new FormData();
                requestBody.append("file", body);
            }
            // Create the request object
            const xhr = new XMLHttpRequest();
            // Build query parameters string
            const queryString = Object.keys(query || {}).reduce((previousValue, key) => {
                let value = query ? query[key] : "";
                value = value !== null && value !== void 0 ? value : "";
                if (typeof value === "object") {
                    try {
                        value = JSON.stringify(value);
                    }
                    catch (err) {
                        value = "";
                    }
                }
                if (previousValue)
                    return `${previousValue}&${key}=${encodeURIComponent(value)}`;
                else
                    return `?${key}=${encodeURIComponent(value)}`;
            }, "");
            xhr.onload = () => {
                if (xhr.status === 200)
                    resolve({ data: JSON.parse(xhr.response), errors: null });
                else {
                    // Error response
                    const errResp = JSON.parse(xhr.response);
                    if ((errResp === null || errResp === void 0 ? void 0 : errResp.errors) &&
                        Array.isArray(errResp.errors) &&
                        errResp.errors.find((entry) => entry.code === INVALID_SESSION_TOKEN ||
                            entry.code === MISSING_SESSION_TOKEN)) {
                        this.apiClient.auth.invalidateSession();
                    }
                    resolve({
                        data: null,
                        errors: {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            items: (errResp === null || errResp === void 0 ? void 0 : errResp.errors)
                                ? Array.isArray(errResp.errors)
                                    ? errResp.errors
                                    : [errResp.errors]
                                : Array.isArray(errResp.errors)
                                    ? errResp
                                    : [errResp],
                        },
                    });
                }
            };
            xhr.onerror = (event) => {
                reject(event);
            };
            // Listen for upload progress events
            xhr.upload.onprogress = (event) => {
                if (progressCallback &&
                    typeof progressCallback === "function" &&
                    event.total)
                    progressCallback(event.loaded, event.total, parseInt(((event.loaded / event.total) * 100).toFixed(), 10));
            };
            // Open and send the request
            xhr.open("POST", this.restUrl + path.trim() + queryString);
            // Set the headers of the request. Browser will set the content type to the correct value,
            // we should not have a content type entry in headers for request with FormData body.
            const headersObj = Object.assign(Object.assign({}, this.headers), (headers || {}));
            const keys = Object.keys(headersObj);
            for (const key of keys) {
                if (key.trim().toLowerCase() !== "content-type") {
                    xhr.setRequestHeader(key, headersObj[key]);
                }
            }
            // Enable sending of auth cookies
            xhr.withCredentials = true;
            xhr.send(requestBody);
        });
    }
}
exports.Fetcher = Fetcher;
_Fetcher_instances = new WeakSet(), _Fetcher_handleRequest = function _Fetcher_handleRequest(method, path, query, headers, body, resolveType = "json") {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Check the path format
            if (!path || !path.trim().startsWith("/"))
                throw new ClientError_1.ClientError("invalid_request_path", "A valid request path with a leading slash '/' needs to be specified e.g., /path");
            // Get the body of the request in the right format
            let requestBody;
            if (body) {
                let isFormDataBody = false;
                // Check if the input body is a FormData object or not. If the client api is used in a Node.js environment
                // we will not have the FormData object by default
                if (typeof FormData !== "undefined" && body instanceof FormData) {
                    requestBody = body;
                    isFormDataBody = true;
                }
                else if (((typeof Blob !== "undefined" && body instanceof Blob) ||
                    (typeof File !== "undefined" && body instanceof File)) &&
                    typeof FormData !== "undefined") {
                    requestBody = new FormData();
                    requestBody.append("file", body);
                    isFormDataBody = true;
                }
                else {
                    // For everthing else we assume JSON format
                    try {
                        requestBody = JSON.stringify(body);
                        if (!headers)
                            headers = {};
                        headers["Content-Type"] = "application/json";
                    }
                    catch (err) {
                        // Seems not a json document, directly set the contents to the body, maybe it is binary body data (e.g., file upload)
                        requestBody = body;
                    }
                }
                // Browser will set the content type to the correct value, we should not have a content type entry in headers
                // for request with FormData body
                if (headers && isFormDataBody) {
                    const keys = Object.keys(headers);
                    for (const key of keys) {
                        if (key.trim().toLowerCase() === "content-type") {
                            delete headers[key];
                        }
                    }
                }
            }
            // Build query parameters string
            const queryString = Object.keys(query || {}).reduce((previousValue, key) => {
                let value = query ? query[key] : "";
                value = value !== null && value !== void 0 ? value : "";
                if (typeof value === "object") {
                    try {
                        value = JSON.stringify(value);
                    }
                    catch (err) {
                        value = "";
                    }
                }
                if (previousValue)
                    return `${previousValue}&${key}=${encodeURIComponent(value)}`;
                else
                    return `?${key}=${encodeURIComponent(value)}`;
            }, "");
            (0, cross_fetch_1.default)(this.restUrl + path.trim() + queryString, {
                method,
                headers: Object.assign(Object.assign({}, this.headers), (headers || {})),
                body: requestBody,
                credentials: "include",
            }).then((response) => __awaiter(this, void 0, void 0, function* () {
                // Success reponse
                if (response.ok) {
                    try {
                        if (resolveType === "json") {
                            resolve({ data: yield response.json(), errors: null });
                        }
                        else if (resolveType === "text")
                            resolve({ data: yield response.text(), errors: null });
                        else if (resolveType === "blob")
                            resolve({ data: yield response.blob(), errors: null });
                        else if (resolveType === "arraybuffer")
                            resolve({ data: yield response.arrayBuffer(), errors: null });
                        else
                            resolve({ data: yield response.json(), errors: null });
                    }
                    catch (err) {
                        resolve({ data: null, errors: null });
                    }
                }
                else {
                    // Error response
                    const errResp = yield response.json();
                    if ((errResp === null || errResp === void 0 ? void 0 : errResp.errors) &&
                        Array.isArray(errResp.errors) &&
                        errResp.errors.find((entry) => entry.code === INVALID_SESSION_TOKEN ||
                            entry.code === MISSING_SESSION_TOKEN)) {
                        this.apiClient.auth.invalidateSession();
                    }
                    resolve({
                        data: null,
                        errors: {
                            status: response.status,
                            statusText: response.statusText,
                            items: (errResp === null || errResp === void 0 ? void 0 : errResp.errors)
                                ? Array.isArray(errResp.errors)
                                    ? errResp.errors
                                    : [errResp.errors]
                                : Array.isArray(errResp)
                                    ? errResp
                                    : [errResp],
                        },
                    });
                }
            }), (error) => {
                // If there is a network error or another reason why the HTTP request couldn't be fulfilled,
                // the fetch() promise will be rejected with a reference to that error.
                return reject(error);
            });
        });
    });
};
//# sourceMappingURL=Fetcher.js.map