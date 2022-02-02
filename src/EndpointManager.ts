import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { KeyValuePair, APIError } from './types';
import { checkRequired } from './utils/helpers';

/**
 * Provides the methods to execute your app backend services by making http request to your app endpoints.
 *
 * If your endpoints require an **API key**, you can set it in two ways either as the **apiKey** input parameter of {@link ClientOptions} to the {@link createClient} function or as an input header with the name **Authorization** (e.g., Authorization: \<your api key\>) in specific methods.
 *
 * Additionally, if your endpoints require a **Session** token, you can also set it in two ways either calling the {@link AuthManager.setSession} method with a valid session object or as an input header with the name **Session** (e.g., Session: \<your session token\>) in specific methods.
 * @export
 * @class EndpointManager
 */
export class EndpointManager extends APIBase {
   /**
    * Creates an instance of EndpointManager to make http requests to your app endpoints.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      super(fetcher);
   }

   /**
    * Makes a GET request to the endpoint path. Optionally, you can provide query string parameters or headers in this request.
    *
    * > *Depending on the configuration of the endpoint, an active user session might be required (e.g., user needs to be logged in) to call this method.*
    * @param {string} path The path of the endpoint. The endpoint path needs to start with a slash '/' character e.g., /users/profile
    * @param {KeyValuePair} [queryParams] Query string parameters as a "key":"value" pair object
    * @param {KeyValuePair} [headers] Additional request headers as a "key":"value" pair object
    * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async get(
      path: string,
      queryParams?: KeyValuePair,
      headers?: KeyValuePair,
      resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      checkRequired('path', path);
      return await this.fetcher.get(path, queryParams, headers, resolveType || 'json');
   }

   /**
    * Makes a POST request to the endpoint path. Optionally, you can provide body, query string parameters or headers in this request.
    *
    * > *Depending on the configuration of the endpoint, an active user session might be required (e.g., user needs to be logged in) to call this method.*
    * @param {string} path The path of the endpoint. The endpoint path needs to start with a slash '/' character e.g., /users/profile
    * @param {FormData | object} [body] Request body **JSON** or **FromData** object
    * @param {KeyValuePair} [queryParams] Query string parameters as a key:value pair object
    * @param {KeyValuePair} [headers] Additional request headers as a key:value pair object
    * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async post(
      path: string,
      body?: FormData | object,
      queryParams?: KeyValuePair,
      headers?: KeyValuePair,
      resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      checkRequired('path', path);
      return await this.fetcher.post(path, body, queryParams, headers, resolveType || 'json');
   }

   /**
    * Makes a PUT request to the endpoint path. Optionally, you can provide body, query string parameters or headers in this request.
    *
    * > *Depending on the configuration of the endpoint, an active user session might be required (e.g., user needs to be logged in) to call this method.*
    * @param {string} path The path of the endpoint. The endpoint path needs to start with a slash '/' character e.g., /users/profile
    * @param {FormData | object} [body] Request body **JSON** or **FromData** object
    * @param {KeyValuePair} [queryParams] Query string parameters as a key:value pair object
    * @param {KeyValuePair} [headers] Additional request headers as a key:value pair object
    * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async put(
      path: string,
      body?: FormData | object,
      queryParams?: KeyValuePair,
      headers?: KeyValuePair,
      resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      checkRequired('path', path);
      return await this.fetcher.put(path, body, queryParams, headers, resolveType || 'json');
   }

   /**
    * Makes a DELETE request to the endpoint path. Optionally, you can provide body, query string parameters or headers in this request.
    *
    * > *Depending on the configuration of the endpoint, an active user session might be required (e.g., user needs to be logged in) to call this method.*
    * @param {string} path The path of the endpoint. The endpoint path needs to start with a slash '/' character e.g., /users/profile
    * @param {FormData | object} [body] Request body **JSON** or **FromData** object
    * @param {KeyValuePair} [queryParams] Query string parameters as a key:value pair object
    * @param {KeyValuePair} [headers] Additional request headers as a key:value pair object
    * @param {'json' | 'text' | 'blob' | 'arraybuffer'} resolveType Type of data to return as a response of the request. By default response data is parsed to JSON. Possible values are json, text, blob and arraybuffer.
    * @returns Returns a promise. The returned response includes two components *data* and *errors*. If errors occured during the execution of the request then errors object is returned and tha data is marked as `null`. If no errors occured then depending on the type of the request the data object holds a *single JSON object*, an *array of json objects*, *plain text*, *Blob* or *ArrayBuffer* and the errors object is marked as `null`. If the response returns no data back then both erros and data marked as `null`.
    */
   async delete(
      path: string,
      body?: FormData | object,
      queryParams?: KeyValuePair,
      headers?: KeyValuePair,
      resolveType?: 'json' | 'text' | 'blob' | 'arraybuffer'
   ): Promise<{ data: any | null; errors: APIError | null }> {
      checkRequired('path', path);
      return await this.fetcher.delete(path, body, queryParams, headers, resolveType || 'json');
   }
}
