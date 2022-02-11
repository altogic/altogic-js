import { ClientError } from './utils/ClientError';
import { checkRequired, normalizeUrl } from './utils/helpers';
import { Fetcher } from './utils/Fetcher';
import { KeyValuePair, ClientOptions } from './types';
import { AuthManager } from './AuthManager';
import { EndpointManager } from './EndpointManager';
import { CacheManager } from './CacheManager';
import { QueueManager } from './QueueManager';
import { TaskManager } from './TaskManager';
import { DatabaseManager } from './DatabaseManager';
import { StorageManager } from './StorageManager';

const DEFAULT_OPTIONS = {
   apiKey: undefined,
   signInRedirect: undefined,
   localStorage: globalThis.window?.localStorage,
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
 *
 * Each AltogicClient can interact with one of your app environments (e.g., development, test, production). You cannot create a single client to interact with multiple development, test or production environments at the same time. If you would like to issue commands to other environments, you need to create additional AltogicClient objects using the target environment's `envUrl`.
 *
 * @export
 * @class AltogicClient
 */
export class AltogicClient {
   /**
    * Altogic client options
    * @protected
    * @type {ClientOptions}
    */
   protected settings: ClientOptions;

   /**
    * HTTP client for the browser, Node or React Native. Primarily used to make RESTful API calls you your backend app. Each command that issue through the client library uses the fetcher to relay it to your backend app.
    * @private
    * @type {Fetcher}
    */
   #fetcher: Fetcher;

   /**
    * AuthManager object is used to manage user authentication and sessions
    * @type {AuthManager}
    */
   #authManager: AuthManager | null;

   /**
    * EndpointManager object is used to make http requests to your app endpoints
    * @type {EndpointManager}
    */
   #epManager: EndpointManager | null;

   /**
    * CacheManager object is used to store and manage objects in Redis cache
    * @type {CacheManager}
    */
   #cacheManager: CacheManager | null;

   /**
    * QueueManager object is used to submit messages to a message queue for asynchronous processing
    * @type {CacheManager}
    */
   #queueManager: QueueManager | null;

   /**
    * TaskManager object is used to trigger execution of scheduled tasks (e.g., cron jobs) manually
    * @type {TaskManager}
    */
   #taskManager: TaskManager | null;

   /**
    * DatabaseManager object is used to perform CRUD (create, read, update and delete) and run queries in your app's database
    * @type {DatabaseManager}
    */
   #databaseManager: DatabaseManager | null;

   /**
    * StorageManager object is used to manage the buckets and files of your app's cloud storage
    * @type {StorageManager}
    */
   #storageManager: StorageManager | null;

   /**
    * Create a new client for web applications.
    * @param {string} envUrl The unique app environment base URL which is generated when you create an environment (e.g., development, test, production) for your backend app. You can access `envUrl` of your app environment from the Environments panel in Altogic designer. Note that, an AltogicClient object can only access a single app environment, you cannot use a development environment `envUrl` to access a test or production environment. To access other environments you need to create additional Altogic client objects with their respective `envUrl` values.
    * @param  {string} clientKey The client library key of the app. You can create client keys from the **App Settings/Client Library** panel in Altogic designer. Besides authenticating your client, client keys are also used to define the authorization rights of each client, e.g., what operations they are allowed to perform on your backend app and define the authorized domains where the client key can be used (e.g., if you list your app domains in your client key configuration, that client key can only be used to make calls to your backend from a front-end app that runs on those specific domains)
    * @param {ClientOptions} [options] Configuration options for the api client
    * @throws Throws an exception if `envUrl` is not specified or not a valid URL path or `clientKey` is not specified
    */
   constructor(envUrl: string, clientKey: string, options?: ClientOptions) {
      if (!envUrl || !(envUrl.trim().startsWith('https://') || envUrl.trim().startsWith('http://')))
         throw new ClientError(
            'missing_required_value',
            'envUrl is a required parameter and needs to start with https://'
         );

      //Client key is also required
      checkRequired('clientKey', clientKey);
      if (typeof clientKey !== 'string')
         throw new ClientError('invalid_client_key', 'clientKey needs to be a valid key string');

      //Initialize internal objects
      this.#authManager = null;
      this.#epManager = null;
      this.#cacheManager = null;
      this.#queueManager = null;
      this.#taskManager = null;
      this.#databaseManager = null;
      this.#storageManager = null;

      //Create combination of default and custom options
      this.settings = { ...DEFAULT_OPTIONS, ...options };

      //Set the default headers
      const headers: KeyValuePair = {
         'X-Client': 'altogic-js',
         'X-Client-Key': clientKey,
      };

      //If apiKey is provided, add it to the default headers
      if (this.settings.apiKey) headers.Authorization = this.settings.apiKey;
      //Create the http client to manage RESTful API calls
      this.#fetcher = new Fetcher(this, normalizeUrl(envUrl), headers);

      //If there is current session info stored in local storage get it an update fetcher session info
      let session = this.auth.getSession();
      this.#fetcher.setSession(session);
   }

   /**
    * Returns the authentication manager that can be used to perform user and session management activities.
    * @readonly
    * @type {AuthManager}
    */
   get auth(): AuthManager {
      if (this.#authManager) return this.#authManager;
      else {
         this.#authManager = new AuthManager(this.#fetcher, this.settings);
         return this.#authManager;
      }
   }

   /**
    * Returns the endpoint manager which is used to make http requests to your app endpoints and execute associated services.
    * @readonly
    * @type {EndpointManager}
    */
   get endpoint(): EndpointManager {
      if (this.#epManager) return this.#epManager;
      else {
         this.#epManager = new EndpointManager(this.#fetcher);
         return this.#epManager;
      }
   }

   /**
    * Returns the cache manager which is used to store and manage objects in Redis cache.
    * @readonly
    * @type {CacheManager}
    */
   get cache(): CacheManager {
      if (this.#cacheManager) return this.#cacheManager;
      else {
         this.#cacheManager = new CacheManager(this.#fetcher);
         return this.#cacheManager;
      }
   }

   /**
    * Returns the queue manager which is used to submit messages to a message queue for processing.
    * @readonly
    * @type {QueueManager}
    */
   get queue(): QueueManager {
      if (this.#queueManager) return this.#queueManager;
      else {
         this.#queueManager = new QueueManager(this.#fetcher);
         return this.#queueManager;
      }
   }

   /**
    * Returns the task manager which is used to trigger scheduled tasks (e.g., cron jobs) for execution.
    * @readonly
    * @type {TaskManager}
    */
   get task(): TaskManager {
      if (this.#taskManager) return this.#taskManager;
      else {
         this.#taskManager = new TaskManager(this.#fetcher);
         return this.#taskManager;
      }
   }

   /**
    * Returns the database manager, which is used to perform CRUD (create, read, update and delete) and run queries in your app's database.
    * @readonly
    * @type {DatabaseManager}
    */
   get db(): DatabaseManager {
      if (this.#databaseManager) return this.#databaseManager;
      else {
         this.#databaseManager = new DatabaseManager(this.#fetcher);
         return this.#databaseManager;
      }
   }

   /**
    * Returns the storage manager, which is used to manage buckets and files of your app.
    * @readonly
    * @type {StorageManager}
    */
   get storage(): StorageManager {
      if (this.#storageManager) return this.#storageManager;
      else {
         this.#storageManager = new StorageManager(this.#fetcher);
         return this.#storageManager;
      }
   }
}
