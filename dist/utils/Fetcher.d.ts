import { AltogicClient } from '../AltogicClient';
import { KeyValuePair, Session, APIError } from '../types';
/**
 * HTTP client for the browser, Node or React Native. Created by {@link AltogicClient} during initialization.
 *
 * When creating the client if apiKey is specified in {@link ClientOptions}, Fetcher adds the provided apiKey to an **Authorization** header and sends it in all RESTful API requests to your backend app.
 *
 * Similarly, if there is an active user session, Fetcher also adds the session token to a **Session** header and sends it in all RESTful API requests to your backend app.
 * @export
 * @class Fetcher
 */
export declare class Fetcher {
    #private;
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
    constructor(apiClient: AltogicClient, restUrl: string, headers: KeyValuePair);
    /**
     * Makes a GET request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    get(path: string, query?: KeyValuePair | null, headers?: KeyValuePair | null, resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'): Promise<{
        data: any | null;
        errors: APIError | null;
    }>;
    /**
     * Makes a POST request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    post(path: string, body?: FormData | object | null, query?: KeyValuePair | null, headers?: KeyValuePair | null, resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'): Promise<{
        data: any | null;
        errors: APIError | null;
    }>;
    /**
     * Makes a PUT request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    put(path: string, body?: FormData | object | null, query?: KeyValuePair | null, headers?: KeyValuePair | null, resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'): Promise<{
        data: any | null;
        errors: APIError | null;
    }>;
    /**
     * Makes a DELETE request to backend app execution environment.
     * @param {string} path The path of the request that will be appended to the {restUrl}
     * @param {FormData | object | null} body The body of the request
     * @param {KeyValuePair} query Query string parameters as key:value pair object
     * @param {KeyValuePair} headers Additional request headers that will be sent with the request
     * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
     * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
     */
    delete(path: string, body?: FormData | object | null, query?: KeyValuePair | null, headers?: KeyValuePair | null, resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'): Promise<{
        data: any | null;
        errors: APIError | null;
    }>;
    /**
     * Sets the session of the user that will be used by Fetcher. Adds the new session token to the **Session** request header.
     * @param  {Session} session Session info object
     * @returns void
     */
    setSession(session: Session | null): void;
    /**
     * Clears the session info of the user from the Fetcher. Basically removes the **Session** header from the default request headers until a new session value is provided.
     * @returns void
     */
    clearSession(): void;
    /**
     * Returns the api base url string.
     * @returns string
     */
    getBaseUrl(): string;
    upload(path: string, body: any, query?: KeyValuePair | null, headers?: KeyValuePair | null, progressCallback?: any): Promise<{
        data: any | null;
        errors: APIError | null;
    }>;
}
//# sourceMappingURL=Fetcher.d.ts.map