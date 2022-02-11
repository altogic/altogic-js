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
import { FileManager } from './FileManager';
import { Fetcher } from './utils/Fetcher';
import { KeyValuePair, Session, ClientOptions, ClientStorage, User, APIError, ErrorEntry, MessageInfo, TaskInfo, GetOptions, SimpleLookup, ComplexLookup, CreateOptions, DeleteOptions, UpdateOptions, SetOptions, AppendOptions, DBAction, SortEntry, FieldUpdate, UpdateInfo, DeleteInfo, GroupComputation, BucketListOptions, BucketSortEntry, FileListOptions, FileSortEntry, FileUploadOptions } from './types';
/**
 * Creates a new client to interact with your backend application developed in Altogic. You need to specify the `envUrl` and `clientKey` to create a new client object. You can create a new environment or access your app `envUrl` from the **Environments** view and create a new `clientKey` from **App Settings/Client library** view in Altogic designer.
 * @param  {string} envUrl The base URL of the Altogic application environment where a snapshot of the application is deployed
 * @param  {string} clientKey The client library key of the app
 * @param  {string} [apiKey] A valid API key of the environment
 * @param  {string} options Additional configuration parameters
 * @returns {AltogicClient} The newly created client instance
 */
declare const createClient: (envUrl: string, clientKey: string, options?: ClientOptions | undefined) => AltogicClient;
export { createClient, APIBase, AltogicClient, AuthManager, EndpointManager, CacheManager, QueueManager, TaskManager, DatabaseManager, Fetcher, KeyValuePair, Session, ClientOptions, ClientStorage, User, APIError, ErrorEntry, MessageInfo, TaskInfo, QueryBuilder, DBObject, GetOptions, SimpleLookup, ComplexLookup, CreateOptions, DeleteOptions, UpdateOptions, SetOptions, AppendOptions, DBAction, SortEntry, FieldUpdate, UpdateInfo, DeleteInfo, GroupComputation, StorageManager, BucketManager, BucketListOptions, BucketSortEntry, FileListOptions, FileSortEntry, FileUploadOptions, FileManager, };
//# sourceMappingURL=index.d.ts.map