import { ClientError } from './utils/ClientError';
import { normalizeUrl } from './utils/helpers';
import { Fetcher } from './utils/Fetcher';
import { KeyValuePair, ClientOptions } from './types';
import { AuthManager } from './AuthManager';
import { EndpointManager } from './EndpointManager';
import { CacheManager } from './CacheManager';

const DEFAULT_OPTIONS = {
   apiKey: undefined,
   localStorage: globalThis.window.localStorage,
};

/**
 * Javascript client for interacting with your backend applications developed in Altogic.
 *
 * AltogicClient is the main object that you will be using to issue commands to your backend apps. The commands that you can run are grouped below:
 * * {@link auth}: {@link AuthManager} - Manage users and user sessions
 * * {@link endpoint}: {@link EndpointManager} - Make http requests to your app endpoints and execute associated services
 * * {@link db}: {@link DatabaseManager} - Perform CRUD (including filtering, sorting, pagination, lookup) operations in your app database
 * * {@link queue}: {@link QueueManager} - Enables you to perform long-running jobs asynchronously by submitting messages to queues
 * * {@link cache}: {@link CacheManager} - Store and manage your data objects in high-speed data storage layer
 * * {@link job}: {@link CronJobsManager} - Manually trigger execution of cron jobs
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
    * HTTP client for the browser, Node or React Native.
    * @private
    * @type {Fetcher}
    */
   #fetcher: Fetcher;

   /**
    * AuthManager object used to manage user authentications and sessions
    * @type {AuthManager}
    */
   #authManager: AuthManager | null;

   /**
    * EndpointManager object used to make http requests to your app endpoints
    * @type {EndpointManager}
    */
   #epManager: EndpointManager | null;

   /**
    * CacheManager object used to store and manage objects in cache
    * @type {CacheManager}
    */
   #cacheManager: CacheManager | null;

   /**
    * Create a new client for web applications.
    * @param {string} baseUrl The unique app environment base URL which is automatically generated when you create an environment for your backend app
    * @param {ClientOptions} [options] Configuration options for the api client
    */
   constructor(baseUrl: string, options?: ClientOptions) {
      if (
         !baseUrl ||
         !(baseUrl.trim().startsWith('https://') || baseUrl.trim().startsWith('http://'))
      )
         throw new ClientError(
            'missing_required_value',
            'baseUrl is a required parameter and needs to start with https://'
         );

      //Initialize internal objects
      this.#authManager = null;
      this.#epManager = null;
      this.#cacheManager = null;

      //Create combination of default and custom options
      this.settings = { ...DEFAULT_OPTIONS, ...options };

      //Set the default headers
      const headers: KeyValuePair = {
         'X-Client': 'altogic-js',
      };

      //If apiKey is provided, add it to the default headers
      if (this.settings.apiKey) headers.Authorization = this.settings.apiKey;
      //Create the http client to manage RESTful API calls
      this.#fetcher = new Fetcher(this, normalizeUrl(baseUrl), headers);

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
    * Returns the cache manager which is used to store and manage objects in cache.
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
}
