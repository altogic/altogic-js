import { Fetcher } from './utils/Fetcher';
import { APIError } from './types';
import { checkRequired } from './utils/helpers';

/**
 * The cache manager provides simple get/set/delete key-value storage.
 *
 * The values stored can be either a single JSON object or an array of objects. Values can be stored with an optional time-to-live (TTL) to automatically expire entries.
 *
 * You cannot directly store primitive values such as integers, strings, etc. If you want to store a primitive value, wrap it in an object and store it as a key-value pair.
 *
 * @export
 * @class CacheManager
 */
export class CacheManager {
   /**
    * The http client to make RESTful API calls to the application's execution engine
    * @private
    * @type {Fetcher}
    */
   #fetcher: Fetcher;

   /**
    * Creates an instance of CacheManager to make caching requests to your backend app.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      this.#fetcher = fetcher;
   }

   /**
    * Gets an item from the cache by key. If key is not found, then `null` is returned as data.
    * @param {string} key The key to retrieve
    */
   async get(key: string): Promise<{ data: object | object[] | null; errors: APIError | null }> {
      checkRequired('key', key);

      return await this.#fetcher.get(`/_api/rest/v1/cache?key=${key}`);
   }

   /**
    * Sets an item in the cache. Overwrites any existing value already set. If **ttl** specified, sets the stored entry to automatically expire in specified seconds. Any previous time to live associated with the key is discarded on successful set operation.
    * @param {string} key The key to update
    * @param {(object | object[])} value The value to set
    * @param {number} ttl Time to live in seconds
    */
   async set(
      key: string,
      value: object | object[],
      ttl?: number
   ): Promise<{ errors: APIError | null }> {
      checkRequired('key', key);
      checkRequired('value', value, false);

      let { errors } = await this.#fetcher.post('/_api/rest/v1/cache', {
         key,
         value,
         ttl: ttl ? ttl : undefined,
      });
      return { errors };
   }

   /**
    * Removes the specified key from the cache. Irrespective of whether the key is found or not, success response is returned.
    * @param {string} key The key to delete
    */
   async delete(key: string): Promise<{ errors: APIError | null }> {
      checkRequired('key', key);

      let { errors } = await this.#fetcher.delete(`/_api/rest/v1/cache?key=${key}`);
      return { errors };
   }
}
