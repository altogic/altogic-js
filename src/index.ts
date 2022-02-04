import { AltogicClient } from './AltogicClient';
import { APIBase } from './APIBase';
import { AuthManager } from './AuthManager';
import { EndpointManager } from './EndpointManager';
import { CacheManager } from './CacheManager';
import { QueueManager } from './QueueManager';
import { TaskManager } from './TaskManager';
import { DatabaseManager } from './DatabaseManager';
import { QueryBuilder } from './QueryBuilder';
import { DBObject } from './DBObject';
import { StorageManager } from './StorageManager';
import { BucketManager } from './BucketManager';
import { Fetcher } from './utils/Fetcher';
import {
   KeyValuePair,
   Session,
   ClientOptions,
   ClientStorage,
   User,
   APIError,
   ErrorEntry,
   MessageInfo,
   TaskInfo,
   GetOptions,
   SimpleLookup,
   ComplexLookup,
   CreateOptions,
   DeleteOptions,
   UpdateOptions,
   SetOptions,
   AppendOptions,
   DBAction,
   SortEntry,
   FieldUpdate,
   UpdateInfo,
   DeleteInfo,
   GroupComputation,
   BucketListOptions,
   BucketSortEntry,
   FileListOptions,
   FileSortEntry,
   FileUploadOptions,
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
   APIBase,
   AltogicClient,
   AuthManager,
   EndpointManager,
   CacheManager,
   QueueManager,
   TaskManager,
   DatabaseManager,
   Fetcher,
   KeyValuePair,
   Session,
   ClientOptions,
   ClientStorage,
   User,
   APIError,
   ErrorEntry,
   MessageInfo,
   TaskInfo,
   QueryBuilder,
   DBObject,
   GetOptions,
   SimpleLookup,
   ComplexLookup,
   CreateOptions,
   DeleteOptions,
   UpdateOptions,
   SetOptions,
   AppendOptions,
   DBAction,
   SortEntry,
   FieldUpdate,
   UpdateInfo,
   DeleteInfo,
   GroupComputation,
   StorageManager,
   BucketManager,
   BucketListOptions,
   BucketSortEntry,
   FileListOptions,
   FileSortEntry,
   FileUploadOptions,
};
