import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import { APIError } from "./types";
import { checkRequired } from "./utils/helpers";

/**
 * The cache manager provides simple key-value storage at a high-speed data storage layer (Redis) speeding up data set and get operations.
 *
 * The values stored can be a single JSON object, an array of objects or primitive values (e.g., numbes, text, boolean). Values can be stored with an optional time-to-live (TTL) to automatically expire entries.
 *
 * You can directly store primitive values such as integers, strings, etc., however, when you try to get them Altogic returns them wrapped in a simple object with a key named `value`. As an example if you store a text field "Hello world!" at a key named 'welcome', when you try to get the value of this key using the {@link get} method, you will receive the following response: { value: "Hellow world"}.
 *
 * @export
 * @class CacheManager
 */
export class CacheManager extends APIBase {
  /**
   * Creates an instance of CacheManager to make caching requests to your backend app.
   * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
   */
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * Gets an item from the cache by key. If key is not found, then `null` is returned as data.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to retrieve
   * @throws Throws an exception if `key` is not specified
   */
  async get(
    key: string
  ): Promise<{ data: object | object[] | null; errors: APIError | null }> {
    checkRequired("key", key);

    return await this.fetcher.get(`/_api/rest/v1/cache?key=${key}`);
  }

  /**
   * Sets an item in the cache. Overwrites any existing value already set. If **ttl** specified, sets the stored entry to automatically expire in specified seconds. Any previous time to live associated with the key is discarded on successful set operation.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to update
   * @param {any} value The value to set
   * @param {number} ttl Time to live in seconds
   * @throws Throws an exception if `key` or `value` is not specified
   */
  async set(
    key: string,
    value: any,
    ttl?: number
  ): Promise<{ errors: APIError | null }> {
    checkRequired("key", key);
    checkRequired("value", value, false);

    const { errors } = await this.fetcher.post("/_api/rest/v1/cache", {
      key,
      value,
      ttl: ttl ? ttl : undefined,
    });
    return { errors };
  }

  /**
   * Removes the specified key from the cache. Irrespective of whether the key is found or not, success response is returned.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to delete
   * @throws Throws an exception if `key` is not specified
   */
  async delete(key: string): Promise<{ errors: APIError | null }> {
    checkRequired("key", key);

    const { errors } = await this.fetcher.delete(
      `/_api/rest/v1/cache?key=${key}`
    );
    return { errors };
  }

  /**
   * Increments the value of the number stored at the key by the increment amount. If increment amount not specified, increments the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. If **ttl** specified, sets the stored entry to automatically expire in specified seconds. Any previous time to live associated with the key is discarded on successful increment operation.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to increment
   * @param {number} [increment=1] The amount to increment the value by
   * @param {number} ttl Time to live in seconds
   * @throws Throws an exception if `key` is not specified
   * @returns Returns the value of key after the increment
   */
  async increment(
    key: string,
    increment: number = 1,
    ttl?: number
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("key", key);

    const { data, errors } = await this.fetcher.post(
      "/_api/rest/v1/cache/increment",
      {
        key,
        increment,
        ttl: ttl ? ttl : undefined,
      }
    );
    return { data, errors };
  }

  /**
   * Decrements the value of the number stored at the key by the decrement amount. If decrement amount not specified, decrements the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. If **ttl** specified, sets the stored entry to automatically expire in specified seconds. Any previous time to live associated with the key is discarded on successful decrement operation.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to decrement
   * @param {number} [decrement=1] The amount to decrement the value by
   * @param {number} ttl Time to live in seconds
   * @throws Throws an exception if `key` is not specified
   * @returns Returns the value of key after the decrement
   */
  async decrement(
    key: string,
    decrement: number = 1,
    ttl?: number
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("key", key);

    const { data, errors } = await this.fetcher.post(
      "/_api/rest/v1/cache/decrement",
      {
        key,
        decrement,
        ttl: ttl ? ttl : undefined,
      }
    );
    return { data, errors };
  }

  /**
   * Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} key The key to set its expiry duration
   * @param {number} ttl Time to live in seconds
   * @throws Throws an exception if `key` or `ttl` is not specified
   */
  async expire(key: string, ttl: number): Promise<{ errors: APIError | null }> {
    checkRequired("key", key);
    checkRequired("ttl", ttl);

    const { errors } = await this.fetcher.post("/_api/rest/v1/cache/expire", {
      key,
      ttl,
    });
    return { errors };
  }
}
