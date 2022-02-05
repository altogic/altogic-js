import fetch from 'cross-fetch';
import { AltogicClient } from '../AltogicClient';
import { KeyValuePair, Session, APIError } from '../types';
import { ClientError } from './ClientError';

const INVALID_SESSION_TOKEN = 'invalid_session_token';
const MISSING_SESSION_TOKEN = 'missing_session_token';
/**
 * HTTP client for the browser, Node or React Native. Created by {@link AltogicClient} during initialization.
 *
 * When creating the client if apiKey is specified in {@link ClientOptions}, Fetcher adds the provided apiKey to an **Authorization** header and sends it in all RESTful API requests to your backend app.
 *
 * Similarly, if there is an active user session, Fetcher also adds the session token to a **Session** header and sends it in all RESTful API requests to your backend app.
 * @export
 * @class Fetcher
 */
export class Fetcher {
   /**
    * Reference to the Altogic client object
    * @protected
    * @type {AltogicClient}
    */
   protected apiClient: AltogicClient;
   /**
    * The base URL that will be prepended to all RESTful API calls
    * @protected
    * @type {string}
    */
   protected restUrl: string;

   /**
    * The default headers that will be sent in each RESTful API request to the execution environment
    * @protected
    * @type {string}
    */
   protected headers: KeyValuePair;

   /**
    * The user session information. After the user is signed in using its app credentials or any Oauth2 provider credentials and if the session is created for this sign in then the user session information is stored in this field. If a session is available then the session token is added to the default headers of the Fetcher
    *
    * @protected
    * @type {(Session | null)}
    */
   protected session: Session | null;

   /**
    *Creates an instance of Fetcher.
    * @param {string} restUrl The base URL that will be prepended to all RESTful API calls
    * @param {KeyValuePair} headers The default headers that will be sent in each RESTful API request to the execution environment
    */
   constructor(apiClient: AltogicClient, restUrl: string, headers: KeyValuePair) {
      this.apiClient = apiClient;
      this.restUrl = restUrl;
      this.headers = headers;
      this.session = null;
   }

   /**
    * Internal method to handle all public request methods (get, post, put and delete). If the request response is invalid session token error, invalidates the current user session.
    * @private
    * @param  {'GET' | 'POST' | 'PUT' | 'DELETE'} method The request method
    * @param  {string} path The path of the request, needs to start with a slash 'character' e.g., /users
    * @param  {KeyValuePair} headers Additional request headers which will be merged with default headers
    * @param  {any} body Request body if any. If provided can be a **JSON object** or a **FormData** object. For file uploads you can use FormData object.
    * @param  {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @throws Throws an exception if `path` is not specified or if it does not start with a leading slash '/'
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async #handleRequest(
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      path: string,
      query: KeyValuePair | null,
      headers: KeyValuePair | null,
      body: any,
      resolveType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      return new Promise((resolve, reject) => {
         //Check the path format
         if (!path || !path.trim().startsWith('/'))
            throw new ClientError(
               'invalid_request_path',
               "A valid request path with a leading slash '/' needs to be specified e.g., /path"
            );

         //Get the body of the request in the right format
         let requestBody = undefined;
         if (body) {
            let isFormDataBody = false;
            //Check if the input body is a FormData object or not. If the client api is used in a Node.js environment
            //we will not have the FormData object by default
            if (typeof FormData !== 'undefined' && body instanceof FormData) {
               requestBody = body;
               isFormDataBody = true;
            } else if (
               ((typeof Blob !== 'undefined' && body instanceof Blob) ||
                  (typeof File !== 'undefined' && body instanceof File)) &&
               typeof FormData !== 'undefined'
            ) {
               requestBody = new FormData();
               requestBody.append('file', body);
               isFormDataBody = true;
            } else {
               //For everthing else we assume JSON format
               try {
                  requestBody = JSON.stringify(body);

                  if (!headers) headers = {};
                  headers['Content-Type'] = 'application/json';
               } catch (err) {
                  //Seems not a json document, directly set the contents to the body, maybe it is binary body data (e.g., file upload)
                  requestBody = body;
               }
            }

            //Browser will set the content type to the correct value, we should not have a content type entry in headers
            //for request with FormData body
            if (headers && isFormDataBody) {
               let keys = Object.keys(headers);
               for (let i = 0; i < keys.length; i++) {
                  const key = keys[i];
                  if (key.trim().toLowerCase() === 'content-type') {
                     delete headers[key];
                  }
               }
            }
         }

         //Build query parameters string
         let queryString = Object.keys(query || {}).reduce((previousValue, key) => {
            let value = query ? query[key] : '';
            value = value ?? '';
            if (typeof value === 'object') {
               try {
                  value = JSON.stringify(value);
               } catch (err) {
                  value = '';
               }
            }

            if (previousValue) return `${previousValue}&${key}=${encodeURIComponent(value)}`;
            else return `?${key}=${encodeURIComponent(value)}`;
         }, '');

         fetch(this.restUrl + path.trim() + queryString, {
            method: method,
            headers: { ...this.headers, ...(headers || {}) },
            body: requestBody,
         }).then(
            async (response) => {
               //Success reponse
               if (response.ok) {
                  try {
                     if (resolveType === 'json') {
                        resolve({ data: await response.json(), errors: null });
                     } else if (resolveType === 'text')
                        resolve({ data: await response.text(), errors: null });
                     else if (resolveType === 'blob')
                        resolve({ data: await response.blob(), errors: null });
                     else if (resolveType === 'arraybuffer')
                        resolve({ data: await response.arrayBuffer(), errors: null });
                     else resolve({ data: await response.json(), errors: null });
                  } catch (err) {
                     resolve({ data: null, errors: null });
                  }
               } else {
                  //Error response
                  let errResp = await response.json();
                  if (
                     errResp?.errors &&
                     Array.isArray(errResp.errors) &&
                     errResp.errors.find(
                        (entry: any) =>
                           entry.code === INVALID_SESSION_TOKEN ||
                           entry.code === MISSING_SESSION_TOKEN
                     )
                  ) {
                     this.apiClient.auth.invalidateSession();
                  }

                  resolve({
                     data: null,
                     errors: {
                        status: response.status,
                        statusText: response.statusText,
                        items: errResp?.errors
                           ? Array.isArray(errResp.errors)
                              ? errResp.errors
                              : [errResp.errors]
                           : Array.isArray(errResp.errors)
                           ? errResp
                           : [errResp],
                     },
                  });
               }
            },
            (error) => {
               //If there is a network error or another reason why the HTTP request couldn't be fulfilled,
               //the fetch() promise will be rejected with a reference to that error.
               return reject(error);
            }
         );
      });
   }

   /**
    * Makes a GET request to backend app execution environment.
    * @param {string} path The path of the request that will be appended to the {restUrl}
    * @param {KeyValuePair} query Query string parameters as key:value pair object
    * @param {KeyValuePair} headers Additional request headers that will be sent with the request
    * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async get(
      path: string,
      query: KeyValuePair | null = {},
      headers: KeyValuePair | null = {},
      resolveType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      return this.#handleRequest('GET', path, query, headers, null, resolveType);
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
   async post(
      path: string,
      body: FormData | object | null = null,
      query: KeyValuePair | null = {},
      headers: KeyValuePair | null = {},
      resolveType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      return this.#handleRequest('POST', path, query, headers, body, resolveType);
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
   async put(
      path: string,
      body: FormData | object | null = null,
      query: KeyValuePair | null = {},
      headers: KeyValuePair | null = {},
      resolveType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      return this.#handleRequest('PUT', path, query, headers, body, resolveType);
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
   async delete(
      path: string,
      body: FormData | object | null = null,
      query: KeyValuePair | null = {},
      headers: KeyValuePair | null = {},
      resolveType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      return this.#handleRequest('DELETE', path, query, headers, body, resolveType);
   }

   /**
    * Sets the session of the user that will be used by Fetcher. Adds the new session token to the **Session** request header.
    * @param  {Session} session Session info object
    * @returns void
    */
   setSession(session: Session | null): void {
      if (session && session.token) {
         this.session = session;
         this.headers.Session = session.token;
      }
   }

   /**
    * Clears the session info of the user from the Fetcher. Basically removes the **Session** header from the default request headers until a new session value is provided.
    * @returns void
    */
   clearSession(): void {
      this.session = null;
      delete this.headers.Session;
   }

   /**
    * Returns the api base url string.
    * @returns string
    */
   getBaseUrl(): string {
      return this.restUrl;
   }
}
