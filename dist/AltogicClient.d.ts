import { ClientOptions } from './types';
import { AuthManager } from './AuthManager';
import { EndpointManager } from './EndpointManager';
import { CacheManager } from './CacheManager';
import { QueueManager } from './QueueManager';
import { TaskManager } from './TaskManager';
import { DatabaseManager } from './DatabaseManager';
import { StorageManager } from './StorageManager';
/**
 * Javascript client for interacting with your backend applications developed in Altogic.
 *
 * AltogicClient is the main object that you will be using to issue commands to your backend apps. The commands that you can run are grouped below:
 * * {@link auth}: {@link AuthManager} - Manage users and user sessions
 * * {@link endpoint}: {@link EndpointManager} - Make http requests to your app endpoints and execute associated services
 * * {@link db}: {@link DatabaseManager} - Perform CRUD (including filtering, sorting, pagination, lookup) operations in your app database
 * * {@link queue}: {@link QueueManager} - Enables you to perform long-running jobs asynchronously by submitting messages to queues
 * * {@link cache}: {@link CacheManager} - Store and manage your data objects in high-speed data storage layer
 * * {@link task}: {@link TaskManager} - Manually trigger execution of scheduled tasks (e.g., cron jobs)
 * @export
 * @class AltogicClient
 */
export declare class AltogicClient {
    #private;
    /**
     * Altogic client options
     * @protected
     * @type {ClientOptions}
     */
    protected settings: ClientOptions;
    /**
     * Create a new client for web applications.
     * @param {string} baseUrl The unique app environment base URL which is automatically generated when you create an environment for your backend app
     * @param  {string} clientKey The client library key of the app
     * @param {ClientOptions} [options] Configuration options for the api client
     * @throws Throws an exception if `baseUrl` is not specified or not a valid URL path
     */
    constructor(baseUrl: string, clientKey: string, options?: ClientOptions);
    /**
     * Returns the authentication manager that can be used to perform user and session management activities.
     * @readonly
     * @type {AuthManager}
     */
    get auth(): AuthManager;
    /**
     * Returns the endpoint manager which is used to make http requests to your app endpoints and execute associated services.
     * @readonly
     * @type {EndpointManager}
     */
    get endpoint(): EndpointManager;
    /**
     * Returns the cache manager which is used to store and manage objects in cache.
     * @readonly
     * @type {CacheManager}
     */
    get cache(): CacheManager;
    /**
     * Returns the queue manager which is used to submit messages to a message queue for processing.
     * @readonly
     * @type {QueueManager}
     */
    get queue(): QueueManager;
    /**
     * Returns the task manager which is used to trigger scheduled tasks (e.g., cron jobs) for execution.
     * @readonly
     * @type {TaskManager}
     */
    get task(): TaskManager;
    /**
     * Returns the database manager, which is used to perform CRUD (create, read, update and delete) and complex query operations in your app's database.
     * @readonly
     * @type {DatabaseManager}
     */
    get db(): DatabaseManager;
    /**
     * Returns the storage manager, which is used to manage buckets and files of your app.
     * @readonly
     * @type {StorageManager}
     */
    get storage(): StorageManager;
}
//# sourceMappingURL=AltogicClient.d.ts.map