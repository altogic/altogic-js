"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a;
var _AltogicClient_fetcher, _AltogicClient_authManager, _AltogicClient_epManager, _AltogicClient_cacheManager, _AltogicClient_queueManager, _AltogicClient_taskManager, _AltogicClient_databaseManager, _AltogicClient_storageManager, _AltogicClient_realtimeManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AltogicClient = void 0;
const ClientError_1 = require("./utils/ClientError");
const helpers_1 = require("./utils/helpers");
const Fetcher_1 = require("./utils/Fetcher");
const AuthManager_1 = require("./AuthManager");
const EndpointManager_1 = require("./EndpointManager");
const CacheManager_1 = require("./CacheManager");
const QueueManager_1 = require("./QueueManager");
const TaskManager_1 = require("./TaskManager");
const DatabaseManager_1 = require("./DatabaseManager");
const StorageManager_1 = require("./StorageManager");
const RealtimeManager_1 = require("./RealtimeManager");
const DEFAULT_OPTIONS = {
    apiKey: undefined,
    signInRedirect: undefined,
    localStorage: (_a = globalThis.window) === null || _a === void 0 ? void 0 : _a.localStorage,
    realtime: {
        autoJoinChannels: true,
        echoMessages: true,
        reconnectionDelay: 1000,
        timeout: 20000,
        bufferMessages: true,
    },
};
/**
 * Javascript client for interacting with your backend applications developed in Altogic.
 *
 * AltogicClient is the main object that you will be using to issue commands to your backend apps. The commands that you can run are grouped below:
 * * {@link auth}: {@link AuthManager} - Manage users and user sessions
 * * {@link endpoint}: {@link EndpointManager} - Make http requests to your app endpoints and execute associated services
 * * {@link db}: {@link DatabaseManager} - Perform CRUD (including lookups, filtering, sorting, pagination) operations in your app database
 * * {@link queue}: {@link QueueManager} - Enables you to run long-running jobs asynchronously by submitting messages to queues
 * * {@link cache}: {@link CacheManager} - Store and manage your data objects in high-speed data storage layer (Redis)
 * * {@link task}: {@link TaskManager} - Manually trigger execution of scheduled tasks (e.g., cron jobs)
 * * {@link realtime}: {@link RealtimeManager} - Publish and subscribe (pub/sub) realtime messaging through websockets
 *
 * Each AltogicClient can interact with one of your app environments (e.g., development, test, production). You cannot create a single client to interact with multiple development, test or production environments at the same time. If you would like to issue commands to other environments, you need to create additional AltogicClient objects using the target environment's `envUrl`.
 *
 * @export
 * @class AltogicClient
 */
class AltogicClient {
    /**
     * Create a new client for web applications.
     * @param {string} envUrl The unique app environment base URL which is generated when you create an environment (e.g., development, test, production) for your backend app. You can access `envUrl` of your app environment from the Environments panel in Altogic designer. Note that, an AltogicClient object can only access a single app environment, you cannot use a development environment `envUrl` to access a test or production environment. To access other environments you need to create additional Altogic client objects with their respective `envUrl` values.
     * @param  {string} clientKey The client library key of the app. You can create client keys from the **App Settings/Client Library** panel in Altogic designer. Besides authenticating your client, client keys are also used to define the authorization rights of each client, e.g., what operations they are allowed to perform on your backend app and define the authorized domains where the client key can be used (e.g., if you list your app domains in your client key configuration, that client key can only be used to make calls to your backend from a front-end app that runs on those specific domains)
     * @param {ClientOptions} [options] Configuration options for the api client
     * @throws Throws an exception if `envUrl` is not specified or not a valid URL path or `clientKey` is not specified
     */
    constructor(envUrl, clientKey, options) {
        /**
         * HTTP client for the browser, Node or React Native. Primarily used to make RESTful API calls you your backend app. Each command that issue through the client library uses the fetcher to relay it to your backend app.
         * @private
         * @type {Fetcher}
         */
        _AltogicClient_fetcher.set(this, void 0);
        /**
         * AuthManager object is used to manage user authentication and sessions
         * @type {AuthManager}
         */
        _AltogicClient_authManager.set(this, void 0);
        /**
         * EndpointManager object is used to make http requests to your app endpoints
         * @type {EndpointManager}
         */
        _AltogicClient_epManager.set(this, void 0);
        /**
         * CacheManager object is used to store and manage objects in Redis cache
         * @type {CacheManager}
         */
        _AltogicClient_cacheManager.set(this, void 0);
        /**
         * QueueManager object is used to submit messages to a message queue for asynchronous processing
         * @type {CacheManager}
         */
        _AltogicClient_queueManager.set(this, void 0);
        /**
         * TaskManager object is used to trigger execution of scheduled tasks (e.g., cron jobs) manually
         * @type {TaskManager}
         */
        _AltogicClient_taskManager.set(this, void 0);
        /**
         * DatabaseManager object is used to perform CRUD (create, read, update and delete) and run queries in your app's database
         * @type {DatabaseManager}
         */
        _AltogicClient_databaseManager.set(this, void 0);
        /**
         * StorageManager object is used to manage the buckets and files of your app's cloud storage
         * @type {StorageManager}
         */
        _AltogicClient_storageManager.set(this, void 0);
        /**
         * RealtimeManager object is used to send and receive realtime message through websockets
         * @type {RealtimeManager}
         */
        _AltogicClient_realtimeManager.set(this, void 0);
        if (!envUrl ||
            !(envUrl.trim().startsWith("https://") ||
                envUrl.trim().startsWith("http://")))
            throw new ClientError_1.ClientError("missing_required_value", "envUrl is a required parameter and needs to start with https://");
        // Client key is also required
        (0, helpers_1.checkRequired)("clientKey", clientKey);
        if (typeof clientKey !== "string")
            throw new ClientError_1.ClientError("invalid_client_key", "clientKey needs to be a valid key string");
        // Initialize internal objects
        __classPrivateFieldSet(this, _AltogicClient_authManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_epManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_cacheManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_queueManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_taskManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_databaseManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_storageManager, null, "f");
        __classPrivateFieldSet(this, _AltogicClient_realtimeManager, null, "f");
        // Create combination of default and custom options
        this.settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.settings.realtime = Object.assign(Object.assign({}, DEFAULT_OPTIONS.realtime), options === null || options === void 0 ? void 0 : options.realtime);
        // Set the default headers
        const headers = {
            "X-Client": "altogic-js",
            "X-Client-Key": clientKey,
        };
        // If apiKey is provided, add it to the default headers
        if (this.settings.apiKey)
            headers.Authorization = this.settings.apiKey;
        // Create the http client to manage RESTful API calls
        __classPrivateFieldSet(this, _AltogicClient_fetcher, new Fetcher_1.Fetcher(this, (0, helpers_1.normalizeUrl)(envUrl), headers), "f");
        // If there is current session info stored in local storage get it an update fetcher session info
        const session = this.auth.getSession();
        __classPrivateFieldGet(this, _AltogicClient_fetcher, "f").setSession(session);
    }
    /**
     * Returns the authentication manager that can be used to perform user and session management activities.
     * @readonly
     * @type {AuthManager}
     */
    get auth() {
        if (__classPrivateFieldGet(this, _AltogicClient_authManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_authManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_authManager, new AuthManager_1.AuthManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f"), this.settings), "f");
            return __classPrivateFieldGet(this, _AltogicClient_authManager, "f");
        }
    }
    /**
     * Returns the endpoint manager which is used to make http requests to your app endpoints and execute associated services.
     * @readonly
     * @type {EndpointManager}
     */
    get endpoint() {
        if (__classPrivateFieldGet(this, _AltogicClient_epManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_epManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_epManager, new EndpointManager_1.EndpointManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_epManager, "f");
        }
    }
    /**
     * Returns the cache manager which is used to store and manage objects in Redis cache.
     * @readonly
     * @type {CacheManager}
     */
    get cache() {
        if (__classPrivateFieldGet(this, _AltogicClient_cacheManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_cacheManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_cacheManager, new CacheManager_1.CacheManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_cacheManager, "f");
        }
    }
    /**
     * Returns the queue manager which is used to submit messages to a message queue for processing.
     * @readonly
     * @type {QueueManager}
     */
    get queue() {
        if (__classPrivateFieldGet(this, _AltogicClient_queueManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_queueManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_queueManager, new QueueManager_1.QueueManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_queueManager, "f");
        }
    }
    /**
     * Returns the task manager which is used to trigger scheduled tasks (e.g., cron jobs) for execution.
     * @readonly
     * @type {TaskManager}
     */
    get task() {
        if (__classPrivateFieldGet(this, _AltogicClient_taskManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_taskManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_taskManager, new TaskManager_1.TaskManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_taskManager, "f");
        }
    }
    /**
     * Returns the database manager, which is used to perform CRUD (create, read, update and delete) and run queries in your app's database.
     * @readonly
     * @type {DatabaseManager}
     */
    get db() {
        if (__classPrivateFieldGet(this, _AltogicClient_databaseManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_databaseManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_databaseManager, new DatabaseManager_1.DatabaseManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_databaseManager, "f");
        }
    }
    /**
     * Returns the storage manager, which is used to manage buckets and files of your app.
     * @readonly
     * @type {StorageManager}
     */
    get storage() {
        if (__classPrivateFieldGet(this, _AltogicClient_storageManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_storageManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_storageManager, new StorageManager_1.StorageManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f")), "f");
            return __classPrivateFieldGet(this, _AltogicClient_storageManager, "f");
        }
    }
    /**
     * Returns the realtime manager, which is used to publish and subscribe (pub/sub) messaging through websockets.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to establish a realtime connection.*
     * @readonly
     * @type {RealtimeManager}
     */
    get realtime() {
        if (__classPrivateFieldGet(this, _AltogicClient_realtimeManager, "f"))
            return __classPrivateFieldGet(this, _AltogicClient_realtimeManager, "f");
        else {
            __classPrivateFieldSet(this, _AltogicClient_realtimeManager, new RealtimeManager_1.RealtimeManager(__classPrivateFieldGet(this, _AltogicClient_fetcher, "f"), this.settings), "f");
            return __classPrivateFieldGet(this, _AltogicClient_realtimeManager, "f");
        }
    }
}
exports.AltogicClient = AltogicClient;
_AltogicClient_fetcher = new WeakMap(), _AltogicClient_authManager = new WeakMap(), _AltogicClient_epManager = new WeakMap(), _AltogicClient_cacheManager = new WeakMap(), _AltogicClient_queueManager = new WeakMap(), _AltogicClient_taskManager = new WeakMap(), _AltogicClient_databaseManager = new WeakMap(), _AltogicClient_storageManager = new WeakMap(), _AltogicClient_realtimeManager = new WeakMap();
//# sourceMappingURL=AltogicClient.js.map