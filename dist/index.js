"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = exports.BucketManager = exports.StorageManager = exports.DBObject = exports.QueryBuilder = exports.Fetcher = exports.DatabaseManager = exports.TaskManager = exports.QueueManager = exports.CacheManager = exports.EndpointManager = exports.AuthManager = exports.AltogicClient = exports.APIBase = exports.createClient = void 0;
const AltogicClient_1 = require("./AltogicClient");
Object.defineProperty(exports, "AltogicClient", { enumerable: true, get: function () { return AltogicClient_1.AltogicClient; } });
const APIBase_1 = require("./APIBase");
Object.defineProperty(exports, "APIBase", { enumerable: true, get: function () { return APIBase_1.APIBase; } });
const AuthManager_1 = require("./AuthManager");
Object.defineProperty(exports, "AuthManager", { enumerable: true, get: function () { return AuthManager_1.AuthManager; } });
const EndpointManager_1 = require("./EndpointManager");
Object.defineProperty(exports, "EndpointManager", { enumerable: true, get: function () { return EndpointManager_1.EndpointManager; } });
const CacheManager_1 = require("./CacheManager");
Object.defineProperty(exports, "CacheManager", { enumerable: true, get: function () { return CacheManager_1.CacheManager; } });
const QueueManager_1 = require("./QueueManager");
Object.defineProperty(exports, "QueueManager", { enumerable: true, get: function () { return QueueManager_1.QueueManager; } });
const TaskManager_1 = require("./TaskManager");
Object.defineProperty(exports, "TaskManager", { enumerable: true, get: function () { return TaskManager_1.TaskManager; } });
const DatabaseManager_1 = require("./DatabaseManager");
Object.defineProperty(exports, "DatabaseManager", { enumerable: true, get: function () { return DatabaseManager_1.DatabaseManager; } });
const QueryBuilder_1 = require("./QueryBuilder");
Object.defineProperty(exports, "QueryBuilder", { enumerable: true, get: function () { return QueryBuilder_1.QueryBuilder; } });
const DBObject_1 = require("./DBObject");
Object.defineProperty(exports, "DBObject", { enumerable: true, get: function () { return DBObject_1.DBObject; } });
const StorageManager_1 = require("./StorageManager");
Object.defineProperty(exports, "StorageManager", { enumerable: true, get: function () { return StorageManager_1.StorageManager; } });
const BucketManager_1 = require("./BucketManager");
Object.defineProperty(exports, "BucketManager", { enumerable: true, get: function () { return BucketManager_1.BucketManager; } });
const FileManager_1 = require("./FileManager");
Object.defineProperty(exports, "FileManager", { enumerable: true, get: function () { return FileManager_1.FileManager; } });
const Fetcher_1 = require("./utils/Fetcher");
Object.defineProperty(exports, "Fetcher", { enumerable: true, get: function () { return Fetcher_1.Fetcher; } });
const polyfills_1 = require("./utils/polyfills");
//Make globalThis available
(0, polyfills_1.polyfillGlobalThis)();
/**
 * Creates a new client to interact with your backend application developed in Altogic. You need to specify the `envUrl` and `clientKey` to create a new client object. You can create a new environment or access your app `envUrl` from the **Environments** view and create a new `clientKey` from **App Settings/Client library** view in Altogic designer.
 * @param  {string} envUrl The base URL of the Altogic application environment where a snapshot of the application is deployed
 * @param  {string} clientKey The client library key of the app
 * @param  {string} [apiKey] A valid API key of the environment
 * @param  {string} options Additional configuration parameters
 * @returns {AltogicClient} The newly created client instance
 */
const createClient = (envUrl, clientKey, options) => {
    return new AltogicClient_1.AltogicClient(envUrl, clientKey, options);
};
exports.createClient = createClient;
//# sourceMappingURL=index.js.map