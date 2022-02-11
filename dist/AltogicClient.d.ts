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
 * * {@link db}: {@link DatabaseManager} - Perform CRUD (including lookups, filtering, sorting, pagination) operations in your app database
 * * {@link queue}: {@link QueueManager} - Enables you to run long-running jobs asynchronously by submitting messages to queues
 * * {@link cache}: {@link CacheManager} - Store and manage your data objects in high-speed data storage layer (Redis)
 * * {@link task}: {@link TaskManager} - Manually trigger execution of scheduled tasks (e.g., cron jobs)
 *
 * Each AltogicClient can interact with one of your app environments (e.g., development, test, production). You cannot create a single client to interact with multiple development, test or production environments at the same time. If you would like to issue commands to other environments, you need to create additional AltogicClient objects using the target environment's `envUrl`.
 *
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
     * @param {string} envUrl The unique app environment base URL which is generated when you create an environment (e.g., development, test, production) for your backend app. You can access `envUrl` of your app environment from the Environments panel in Altogic designer. Note that, an AltogicClient object can only access a single app environment, you cannot use a development environment `envUrl` to access a test or production environment. To access other environments you need to create additional Altogic client objects with their respective `envUrl` values.
     * @param  {string} clientKey The client library key of the app. You can create client keys from the **App Settings/Client Library** panel in Altogic designer. Besides authenticating your client, client keys are also used to define the authorization rights of each client, e.g., what operations they are allowed to perform on your backend app and define the authorized domains where the client key can be used (e.g., if you list your app domains in your client key configuration, that client key can only be used to make calls to your backend from a front-end app that runs on those specific domains)
     * @param {ClientOptions} [options] Configuration options for the api client
     * @throws Throws an exception if `envUrl` is not specified or not a valid URL path or `clientKey` is not specified
     */
    constructor(envUrl: string, clientKey: string, options?: ClientOptions);
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
     * Returns the cache manager which is used to store and manage objects in Redis cache.
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
     * Returns the database manager, which is used to perform CRUD (create, read, update and delete) and run queries in your app's database.
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