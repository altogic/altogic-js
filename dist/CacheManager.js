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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
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
class CacheManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of CacheManager to make caching requests to your backend app.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Gets an item from the cache by key. If key is not found, then `null` is returned as data.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} key The key to retrieve
     * @throws Throws an exception if `key` is not specified
     */
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            return yield this.fetcher.get(`/_api/rest/v1/cache?key=${key}`);
        });
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
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            (0, helpers_1.checkRequired)('value', value, false);
            const { errors } = yield this.fetcher.post('/_api/rest/v1/cache', {
                key,
                value,
                ttl: ttl ? ttl : undefined,
            });
            return { errors };
        });
    }
    /**
     * Removes the specified key from the cache. Irrespective of whether the key is found or not, success response is returned.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} key The key to delete
     * @throws Throws an exception if `key` is not specified
     */
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            const { errors } = yield this.fetcher.delete(`/_api/rest/v1/cache?key=${key}`);
            return { errors };
        });
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
    increment(key, increment = 1, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            const { data, errors } = yield this.fetcher.post('/_api/rest/v1/cache/increment', {
                key,
                increment,
                ttl: ttl ? ttl : undefined,
            });
            return { data, errors };
        });
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
    decrement(key, decrement = 1, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            const { data, errors } = yield this.fetcher.post('/_api/rest/v1/cache/decrement', {
                key,
                decrement,
                ttl: ttl ? ttl : undefined,
            });
            return { data, errors };
        });
    }
    /**
     * Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} key The key to set its expiry duration
     * @param {number} ttl Time to live in seconds
     * @throws Throws an exception if `key` or `ttl` is not specified
     */
    expire(key, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('key', key);
            (0, helpers_1.checkRequired)('ttl', ttl);
            const { errors } = yield this.fetcher.post('/_api/rest/v1/cache/expire', {
                key,
                ttl,
            });
            return { errors };
        });
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map