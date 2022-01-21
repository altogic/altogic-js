import { AltogicClient } from './AltogicClient';
import { AuthManager } from './AuthManager';
import { EndpointManager } from './EndpointManager';
import { CacheManager } from './CacheManager';
import { Fetcher } from './utils/Fetcher';
import {
   KeyValuePair,
   Session,
   ClientOptions,
   ClientStorage,
   User,
   APIError,
   ErrorEntry,
} from './types';
import { polyfillGlobalThis } from './utils/polyfills';

//Make globalThis available
polyfillGlobalThis();

/**
 * Creates a new client to interact with your backend application developed in Altogic.
 * @param  {string} envUrl The base URL of the Altogic application environment where a snapshot of the application is deployed
 * @param  {string} [apiKey] A valid API key of the environment
 * @param  {string} options Additional configuration parameters
 * @returns {AltogicClient} The newly created client instance
 */
const createClient = (envUrl: string, options?: ClientOptions): AltogicClient => {
   return new AltogicClient(envUrl, options);
};

export {
   createClient,
   AltogicClient,
   AuthManager,
   EndpointManager,
   CacheManager,
   Fetcher,
   KeyValuePair,
   Session,
   ClientOptions,
   ClientStorage,
   User,
   APIError,
   ErrorEntry,
};
