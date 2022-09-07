/**
 * Represents a basic javascript object with key-value pairs
 * @export
 * @interface KeyValuePair
 */
export interface KeyValuePair {
  [key: string]: any;
}

/**
 * Provides info about a user.
 * @export
 * @interface User
 */
export interface User {
  /**
   * The unique identifier of the user
   * @type {string}
   */
  _id: string;
  /**
   * The authentication provider name, can be either Altogic, Google, Faceboo, Twitter etc.
   * @type {string}
   */
  provider: string;
  /**
   * The user id value that is retrieved from the provider after successful user authentication. The format of this field value can be different for each provider. If the provider is Altogic, providerUserId and _id values are the same.
   * @type {string}
   */
  providerUserId: string;
  /**
   * Users email address
   * @type {string}
   */
  email: string;
  /**
   * Users password, valid only if Altogic is used as the authentication provider.
   * @type {string}
   */
  password?: string;
  /**
   * Users password, valid only if Altogic is used as the authentication provider. Should be at least 6 characters long.
   * @type {string}
   */
  profilePicture?: string;
  /**
   * The name of the user
   * @type {string}
   */
  name?: string;
  /**
   * The last login date and time of the user. For each successful sign-in, this field is updated in the database.
   * @type {string}
   */
  lastLoginAt: string;
  /**
   * The sign up date and time of the user
   * @type {string}
   */
  signUpAt: string;
}

/**
 * Keeps session information of a specific user
 * @export
 * @interface Session
 */
export interface Session {
  /**
   * The id of the application end user this session is associated with
   * @type {string}
   */
  userId: string;

  /**
   * Unique session token string
   * @type {string}
   */
  token: string;

  /**
   * Creation date and time of the session token
   * @type {string}
   */
  creationDtm: string;

  /**
   * Access group keys associated with this user session. With access groups you can assign roles to users and their sessions and enabled role based access control to your app endpoints
   * @type {string[]}
   */
  accessGroupKeys: string[];

  /**
   * The user-agent (device) information of the user's session
   * @type {object}
   */
  userAgent: {
    family: string;
    major: string;
    minor: string;
    patch: string;
    device: {
      family: string;
      major: string;
      minor: string;
      patch: string;
    };
    os: {
      family: string;
      major: string;
      minor: string;
      patch: string;
    };
  };
}

/**
 * The options that can be passed to the Altogic client instance
 *
 * @export
 * @interface ClientOptions
 */
export interface ClientOptions {
  /**
   * The unique app environment API Key which needs to be created using the Altogic app designer. The `apiKey`is passed in *Authorization Header* when making RESTful API calls to your app endpoints. This key is different than the `clientKey` used when creating an instance of Altogic client library. `clientKey` is primarily used to manage access rigths of the client library whereas `apiKey` is used to manage access to your app endpoints.
   * @type {string}
   */
  apiKey?: string;

  /**
   * Client storage handler to store user and session data. By default uses Window.localStorage of the browser. If client is not a browser then you need to provide an object with setItem(key:string, data:object), getItem(key:string) and removeItem(key:string) methods to manage user and session data storage.
   * @type Storage
   */
  localStorage?: ClientStorage;

  /**
   * The sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.
   * @type {string}
   */
  signInRedirect?: string;

  /**
   * The configuration parameters for websocket connections
   * @type {RealtimeOptions}
   */
  realtime?: RealtimeOptions;
}

/**
 * The options that can be passed to the client instance realtime module
 *
 * @export
 * @interface RealtimeOptions
 */
export interface RealtimeOptions {
  /**
   * The flag to enable or prevent automatic join to channels already subscribed in case of websocket reconnection. When websocket is disconnected, it automatically leaves subscribed channels. This parameter helps re-joining to already joined channels when the connection is restored.
   * @type {boolean}
   */
  autoJoinChannels?: boolean;

  /**
   * The flag to enable or prevent realtime messages originating from this connection being echoed back on the same connection.
   * @type {boolean}
   */
  echoMessages?: boolean;

  /**
   * The initial delay before realtime reconnection in milliseconds.
   * @type {number}
   */
  reconnectionDelay?: number;

  /**
   * The timeout in milliseconds for each realtime connection attempt.
   * @type {number}
   */
  timeout?: number;

  /**
   * By default, any event emitted while the realtime socket is not connected will be buffered until reconnection. You can turn on/off the message buffering using this parameter.
   * @type {number}
   */
  bufferMessages?: boolean;
}
/**
 * Client lcoal storage handler definition. By default Atlogic client library uses Window.localStorage of the browser.
 *
 * If you prefer to use a different storage handler besides Window.localStorage or if you are using the Altogic client library at the server (not browser) then you need to provide your storage implementation.
 * This implementation needs to support mainly three methods, getItem, setItem and removeItem
 *
 * @interface ClientStorage
 */
export interface ClientStorage {
  getItem(key: string): null | string;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Provides information about the errors happened during execution of the requests
 * @export
 * @interface APIError
 */
export interface APIError {
  /**
   *  HTTP response code in the 100–599 range
   * @type {number}
   */
  status: number;

  /**
   * Status text as reported by the server, e.g. "Unauthorized"
   * @type {string}
   */
  statusText: string;

  /**
   * Array of error entries that provide detailed information about the errors occured during excution of the request
   * @type {ErrorEntry[]}
   */
  items: ErrorEntry[];
}

/**
 * Provides info about an error.
 * @export
 * @interface ErrorEntry
 */
export interface ErrorEntry {
  /**
   * Originator of the error either a client error or an internal server error
   * @type {string}
   */
  origin: string;

  /**
   * Specific short code of the error message (e.g., validation_error, content_type_error)
   * @type {string}
   */
  code: string;

  /**
   * Short description of the error
   * @type {string}
   */
  message: string;

  /**
   * Any additional details about the error. Details is a JSON object and can have a different structure for different error types.
   * @type {object}
   */
  details?: object;
}

/**
 * Provides info about the status of a message that is submitted to a queue.
 * @export
 * @interface MessageInfo
 */
export interface MessageInfo {
  /**
   * The id of the message
   * @type {string}
   */
  messageId: string;
  /**
   * The id of the queue this message is submitted to
   * @type {string}
   */
  queueId: string;
  /**
   * The name of the queue this message is submitted to
   * @type {string}
   */
  queueName: string;
  /**
   * The message submit date-time
   * @type {string}
   */
  submittedAt: string;
  /**
   * The message processing start date-time
   * @type {string}
   */
  startedAt: string;
  /**
   * The message processing complete date-time
   * @type {string}
   */
  completedAt: string;
  /**
   * The status of the message. When the message is submitted to the queue, it is in `pending` status. When the message is being processed, its status changes to `processing`. If message is successfully completed its status becomes `complete`otherwiese it becomes `errors`.
   * @type {string}
   */
  status: "pending" | "processing" | "completed" | "errors";

  /**
   * Provides information about the errors occurred during processing of the message
   * @type {object}
   */
  errors: object;
}

/**
 * Provides info about the status of a task that is triggered for execution.
 * @export
 * @interface TaskInfo
 */
export interface TaskInfo {
  /**
   * The id of the task
   * @type {string}
   */
  taskId: string;
  /**
   * The id of the scheduled task that is triggered
   * @type {string}
   */
  scheduledTaskId: string;
  /**
   * The name of the scheduled task that is triggered
   * @type {string}
   */
  scheduledTaskName: string;
  /**
   * The task trigger date-time
   * @type {string}
   */
  triggeredAt: string;
  /**
   * The task execution start date-time
   * @type {string}
   */
  startedAt: string;
  /**
   * The task execution complete date-time
   * @type {string}
   */
  completedAt: string;
  /**
   * The status of the task. When the task is firts triggered, it is in `pending` status. When the task is being processed, its status changes to `processing`. If task is successfully completed its status becomes `complete`otherwiese it becomes `errors`.
   * @type {string}
   */
  status: "pending" | "processing" | "completed" | "errors";

  /**
   * Provides information about the errors occurred during execution of the task
   * @type {object}
   */
  errors: object;
}

/**
 * Defines the options for an object read operation
 * @export
 * @interface GetOptions
 */
export interface GetOptions {
  /**
   * Specify whether to cache the retrieved object using its id as the cache key or not. If the object is cached and the timeout has expired, the cached object will automatically be removed from the cache.
   * @type {string}
   */
  cache:
    | "nocache"
    | "noexpiry"
    | "30sec"
    | "1min"
    | "2mins"
    | "5mins"
    | "10mins"
    | "15mins"
    | "30mins"
    | "1hour"
    | "6hours"
    | "12hours"
    | "1day"
    | "1week"
    | "1month"
    | "6months"
    | "1year";
}

/**
 * Defines the structure of a simple lookup
 * @export
 * @interface SimpleLookup
 */
export interface SimpleLookup {
  /**
   * The name of the object reference field of the model that will be looked up. Only the immediate fields of the model can be used in simple lookups. If you would like to look up for a sub-object field then you need to use that respective sub-model as the reference point of your lookups. The simple lookup basically runs the following query: `this.field == lookup._id`, meaning joins the looked up model with the current one by matching the value of the field with the _id of the looked up model.
   * @type {string}
   */
  field: string;
}

/**
 * Defines the structure of a complex lookup
 * @export
 * @interface ComplexLookup
 */
export interface ComplexLookup {
  /**
   * The name of the lookup. This will become a field of the retrieved object which will hold the looked up value. The specified name needs to be **unique** among the fields of the model.
   * @type {string}
   */
  name: string;
  /**
   * The name of the target model which will be joined with the current model
   * @type {string}
   */
  modelName: string;
  /**
   * The query expression that will be used in joining the models
   * @type {string}
   */
  query: string;
}

/**
 * Defines the options for an object create operation
 * @export
 * @interface CreateOptions
 */
export interface CreateOptions {
  /**
   * Specify whether to cache the created object using its id as the cache key or not. If the object is cached and the timeout has expired, the cached object will automatically be removed from the cache.
   * @type {string}
   */
  cache:
    | "nocache"
    | "noexpiry"
    | "30sec"
    | "1min"
    | "2mins"
    | "5mins"
    | "10mins"
    | "15mins"
    | "30mins"
    | "1hour"
    | "6hours"
    | "12hours"
    | "1day"
    | "1week"
    | "1month"
    | "6months"
    | "1year";
}

/**
 * Defines the options for an object set operation
 * @export
 * @interface SetOptions
 */
export interface SetOptions {
  /**
   * Specify whether to cache the set object using its id as the cache key or not. If the object is cached and the timeout has expired, the cached object will automatically be removed from the cache.
   * @type {string}
   */
  cache:
    | "nocache"
    | "noexpiry"
    | "30sec"
    | "1min"
    | "2mins"
    | "5mins"
    | "10mins"
    | "15mins"
    | "30mins"
    | "1hour"
    | "6hours"
    | "12hours"
    | "1day"
    | "1week"
    | "1month"
    | "6months"
    | "1year";

  /**
   * When you create a submodel object (a child object of a top-level object), you can specify whether to return the newly created child object or the updated top-level object.
   * @type {boolean}
   */
  returnTop: boolean;
}

/**
 * Defines the options for an object append operation
 * @export
 * @interface AppendOptions
 */
export interface AppendOptions {
  /**
   * Specify whether to cache the appended object using its id as the cache key or not. If the object is cached and the timeout has expired, the cached object will automatically be removed from the cache.
   * @type {string}
   */
  cache:
    | "nocache"
    | "noexpiry"
    | "30sec"
    | "1min"
    | "2mins"
    | "5mins"
    | "10mins"
    | "15mins"
    | "30mins"
    | "1hour"
    | "6hours"
    | "12hours"
    | "1day"
    | "1week"
    | "1month"
    | "6months"
    | "1year";

  /**
   * When you create a submodel object (a child object of a top-level object), you can specify whether to return the newly created child object or the updated top-level object.
   * @type {boolean}
   */
  returnTop: boolean;
}

/**
 * Defines the options for an object delete operation
 * @export
 * @interface DeleteOptions
 */
export interface DeleteOptions {
  /**
   * Specify whether to remove deleted object from cache using deleted object id as the cache key.
   * @type {string}
   */
  removeFromCache: boolean;

  /**
   * In case if you delete a submodel object (a child object of a top-level object), you can specify whether to return the updated top-level object.
   * @type {boolean}
   */
  returnTop: boolean;
}

/**
 * Defines the options for an object update operation
 * @export
 * @interface UpdateOptions
 */
export interface UpdateOptions {
  /**
   * Specify whether to cache the updated object using its id as the cache key or not. If the object is cached and the timeout has expired, the cached object will automatically be removed from the cache.
   * @type {string}
   */
  cache:
    | "nocache"
    | "noexpiry"
    | "30sec"
    | "1min"
    | "2mins"
    | "5mins"
    | "10mins"
    | "15mins"
    | "30mins"
    | "1hour"
    | "6hours"
    | "12hours"
    | "1day"
    | "1week"
    | "1month"
    | "6months"
    | "1year";

  /**
   * In case if you update a submodel object (a child object of a top-level object), you can specify whether to return the newly updated child object or the updated top-level object.
   * @type {boolean}
   */
  returnTop: boolean;
}

/**
 * Defines the structure of a db action that is built by a {@link QueryBuilder}
 * @export
 * @interface DBAction
 */
export interface DBAction {
  /**
   * The filter query expression string
   * @type {string | null}
   */
  expression: string | null | undefined;
  /**
   * The list of lookups to make (left outer join) while getting the object from the database
   * @type {([SimpleLookup | ComplexLookup]| null | undefined)}
   */
  lookups: [SimpleLookup | ComplexLookup] | null | undefined;
  /**
   * A positive integer that specifies the page number to paginate query results. Page numbers start from 1.
   * @type {(number | null | undefined)}
   */
  page: number | null | undefined;
  /**
   * A positive integer that specifies the max number of objects to return per page
   * @type {(number | null | undefined)}
   */
  limit: number | null | undefined;
  /**
   * Keeps the list of field names and sort direction for sorting returned objects
   * @type {([SortEntry] | null | undefined)}
   */
  sort: [SortEntry] | null | undefined;
  /**
   * The list of fields that will be omitted in retrieved objects
   * @type {(string[]| null | undefined)}
   */
  omit: string[] | null | undefined;

  /**
   * The grouping definition of the query builder. If you want to group the query results by values of specific fields, then provide the name of the fields in a string array format e.g., ['field1', 'field2.subField', ...]
   *
   * If you prefer to group the query results by an expression then just provide the expression string.
   *
   * @type {(string | string[] | null | undefined)}
   */
  group: string | string[] | null | undefined;
}

/**
 * Defines the structure of sort entry
 * @export
 * @interface SortEntry
 */
export interface SortEntry {
  /**
   * The name of the field that will be used in sorting the returned objects. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
   * @type {string}
   */
  field: string;
  /**
   * Sort direction
   * @type {string}
   */
  direction: "asc" | "desc";
}

/**
 * Defines the structure of a field update
 * @export
 * @interface FieldUpdate
 */
export interface FieldUpdate {
  /**
   * The name of the field whose value will be updated. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField). Please note that only sub-model object fields can be accessed through the dot-notation. You cannot create an update instruction for an object-list field through the dot-notation.
   * @type {string}
   */
  field: string;

  /**
   * Defines how the field will be updated.
   * - **set:** Sets (overwrites) the value of a field. Applicable on all fields, except system managed `_id`, `_parent`, `createdAt`, `updatedAt` fields.
   * - **unset:** Clears the value of a field. Applicable on all fields, except system managed `_id`, `_parent`, `createdAt`, `updatedAt` fields.
   * - **increment:** Increments the value of a numeric field by the specified amount. Applicable only for integer and decimal fields.
   * - **decrement:** Decrements the value of a numeric field by the specified amount. Applicable only for integer and decimal fields.
   * - **min:** Assigns the minimum of the specified value or the field value. If the specified value is less than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields.
   * - **max:** Assigns the maximum of the specified value or the field value. If the specified value is greater than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields.
   * - **multiply:** Multiplies the current value of the field with the specified amount and sets the field value to teh multiplication result. Applicable only for integer and decimal fields.
   * - **pull:** Removes the specified value from a basic values list. Applicable only for basic values list fields.
   * - **push:** Adds the specified value to a basic values list. Applicable only for basic values list fields.
   * - **pop:** Removes the last element from a basic values list. Applicable only for basic values list fields.
   * - **shift:** Removes the first element from a basic values list. Applicable only for basic values list fields.
   * @type {('set'
   *       | 'unset'
   *       | 'increment'
   *       | 'decrement'
   *       | 'min'
   *       | 'max'
   *       | 'multiply'
   *       | 'pull'
   *       | 'push'
   *       | 'pop'
   *       | 'shift')}
   */
  updateType:
    | "set"
    | "unset"
    | "increment"
    | "decrement"
    | "min"
    | "max"
    | "multiply"
    | "pull"
    | "push"
    | "pop"
    | "shift";

  /**
   * The value that will be used during the field update. Depending on the update type the value will have different meaning.
   * - **set:** The new value to set
   * - **unset:** Not applicable, value is not needed
   * - **increment:** The icrement amount
   * - **decrement:** The decrement amount
   * - **min:** The min amount to compare against current field value
   * - **max:** The max amount to compare against current field value
   * - **multiply:** The multiplication amount
   * - **pull:** Basic value list item to remove
   * - **push:** Basic value list item to add
   * - **pop:** Not applicable, value is not needed
   * - **shift:** Not applicable, value is not needed
   * @type {*}
   */
  value: any;
}

/**
 * Defines the structure of the response of a multi-object update operation in the database
 * @export
 * @interface UpdateInfo
 */
export interface UpdateInfo {
  /**
   * Total number of objects that matched to the filter query
   * @type {number}
   */
  totalMatch: number;
  /**
   * Number of objects updated
   * @type {number}
   */
  updated: number;
}

/**
 * Defines the structure of the response of a multi-object delete operation in the database
 * @export
 * @interface UpdateInfo
 */
export interface DeleteInfo {
  /**
   * Total number of objects that matched to the filter query
   * @type {number}
   */
  totalMatch: number;
  /**
   * Number of objects deleted
   * @type {number}
   */
  deleted: number;
}

/**
 * Defines the structure of grouped object computations. Basically, it provides aggregate calculation instructions to {@link QueryBuilder.compute} method
 * @export
 * @interface GroupComputation
 */
export interface GroupComputation {
  /**
   * The name of the computation which will be reported in the result of {@link QueryBuilder.compute} method execution. If you are defining more than one group computation, then their names need to be unique.
   * @type {string}
   */
  name: string;
  /**
   *  Defines the type of the computation
   * - **count:** Counts the number of objects in each group
   * - **countif:** Counts the number of objects in each group based on the result of the specified expression. If the expression evaluates to true then they are counted otherwise not.
   * - **sum:** Sums the evaluated expression values for each group member. The expression needs to return an integer or decimal value.
   * - **avg:** Averages the evaluated expression values for the overall group. The expression needs to return an integer or decimal value.
   * - **min:** Calculates the minimum value of the evaluated expression for the overall group. The expression needs to return an integer or decimal value.
   * - **max:** Calculates the maximum value of the evaluated expression for the overall group. The expression needs to return an integer or decimal value.
   *
   * @type {('count' | 'countif' | 'sum' | 'avg' | 'min' | 'max')}
   * @memberof GroupComputation
   */
  type: "count" | "countif" | "sum" | "avg" | "min" | "max";
  /**
   * The computation expression string. Except **count**, expression string is required for all other computation types.
   * @type {string}
   * @memberof GroupComputation
   */
  expression: string;
  /**
   *  Defines the sort direction of computed field. If sort direction is specified as either `asc` or `desc`, computed groups will be sorted accordingly.
   *
   * @type {('none' | 'asc' | 'desc')}
   * @memberof GroupComputation
   */
  sort: "none" | "asc" | "desc";
}

/**
 * Defines the structure how to get app buckets
 * @export
 * @interface BucketListOptions
 */
export interface BucketListOptions {
  /**
   * A positive integer that specifies the page number to paginate bucket results. Page numbers start from 1.
   * @type {(number | null | undefined)}
   */
  page: number | null | undefined;
  /**
   * A positive integer that specifies the max number of buckets to return per page
   * @type {(number | null | undefined)}
   */
  limit: number | null | undefined;
  /**
   * Specifies the field name and sort direction for sorting returned buckets
   * @type {(BucketSortEntry | null | undefined)}
   */
  sort: BucketSortEntry | null | undefined;
  /**
   * Flag to specify whether to return the count and pagination information such as total number of buckets, page number and page size
   * @type {boolean}
   */
  returnCountInfo: boolean;
}

/**
 * Defines the structure of a bucket sort entry
 * @export
 * @interface BucketSortEntry
 */
export interface BucketSortEntry {
  /**
   * The name of the bucket field that will be used in sorting the returned objects
   * @type {string}
   */
  field: "name" | "isPublic" | "createdAt" | "updatedAt" | "userId" | "tags";
  /**
   * Sort direction
   * @type {string}
   */
  direction: "asc" | "desc";
}

/**
 * Defines the structure how to get the files of a bucket
 * @export
 * @interface FileListOptions
 */
export interface FileListOptions {
  /**
   * A positive integer that specifies the page number to paginate file results. Page numbers start from 1.
   * @type {(number | null | undefined)}
   */
  page: number | null | undefined;
  /**
   * A positive integer that specifies the max number of files to return per page
   * @type {(number | null | undefined)}
   */
  limit: number | null | undefined;
  /**
   * Specifies the field name and sort direction for sorting returned files
   * @type {(FileSortEntry | null | undefined)}
   */
  sort: FileSortEntry | null | undefined;
  /**
   * Flag to specify whether to return the count and pagination information such as total number of files, page number and page size
   * @type {boolean}
   */
  returnCountInfo: boolean;
}

/**
 * Defines the structure of a file sort entry
 * @export
 * @interface FileSortEntry
 */
export interface FileSortEntry {
  /**
   * The name of the file field that will be used in sorting the returned objects
   * @type {string}
   */
  field:
    | "bucketId"
    | "fileName"
    | "size"
    | "encoding"
    | "mimeType"
    | "isPublic"
    | "publicPath"
    | "uploadedAt"
    | "updatedAt"
    | "userId"
    | "tags";
  /**
   * Sort direction
   * @type {string}
   */
  direction: "asc" | "desc";
}

/**
 * Defines the options available that can be set during file upload
 * @export
 * @interface FileUploadOptions
 */
export interface FileUploadOptions {
  /**
   * The `Content-Type` header value. This value needs to be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   * @type {string}
   */
  contentType: string;
  /**
   * Specifies whether file is publicy accessible or not. Defaults to the bucket's privacy setting if not specified.
   * @type {boolean}
   */
  isPublic: boolean;
  /**
   * Specifies whether to create the bucket while uploading the file. If a bucket with the provided name does not exists and if `createBucket` is marked as true then creates a new bucket. Defaults to false.
   * @type {boolean}
   */
  createBucket: boolean;
  /**
   * Array of string values that will be added to the file metadata.
   * @type {string[]}
   */
  tags: string;
  /**
   * Callback function to call during file upload.
   *
   * **For the moment, this method can only be used in clients where `XMLHttpRequest` object is available (e.g., browsers).**
   * @param uploaded Total bytes uploaded
   * @param total Total size of file in bytes
   * @param percentComplete Percent uploaded (an integer between 0-100), basicly `uploaded/total` rounded to the nearest integer
   */
  onProgress(uploaded: number, total: number, percentComplete: number): any;
}

/**
 * Defines the cookie options. Primarly used to specify the otpions when setting the sessionToken cookie which is used to pass session token from the client (e.g., browser) to the server (e.g., next.js, express) in an app where server side rendering is used.
 * @export
 * @interface CookieOptions
 */
export interface CookieOptions {
  /**
   * Specifies the path that must exist in the requested URL for the browser to send the Cookie header.
   * @type {string}
   */
  path: string;
  /**
   * Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
   * @type {number}
   */
  maxAge: number;
  /**
   * Controls whether or not a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks.
   * @type {string}
   */
  sameSite: "strict" | "lax" | "none";
  /**
   * If set to `true`, forbids JavaScript from accessing the cookie.
   * @type {boolean}
   */
  httpOnly: boolean;
  /**
   * If set to `true`, indicates that the cookie is sent to the server only when a request is made with the https: scheme (except on localhost), and therefore, is more resistant to man-in-the-middle attacks.
   * @type {boolean}
   */
  secure: boolean;
}

/**
 * Defines the structure of the realtime event data (message) delivered to the clients.
 * @export
 * @interface EventData
 */
export interface EventData {
  /**
   * The name of the channel this message is sent to. If channel is null, this means that that message is broadcasted to all connected clients of your app.
   * @type {string}
   */
  channel: string | null;
  /**
   * Contents of the message. All serializable datastructures are supported for the message, including Buffer.
   * @type {any}
   */
  message: any;
}
/**
 * Defines the structure of listener (callback) functions for realtime events (messages). Basically a listener function accepts only a single parameter of event data.
 * @export
 * @type ListenerFunction
 */
export type ListenerFunction = (payload: EventData) => void;

/**
 * Defines the structure of the channel member data.
 * @export
 * @interface MemberData
 */
export interface MemberData {
  /**
   * The unique socket id of the channel member
   * @type {string}
   */
  id: string;
  /**
   * Data payload for the channel member. The supported payload types are strings, JSON objects and arrays, buffers containing arbitrary binary data, and null. This data is typically set calling the {@link RealtimeManager.update} method.
   * @type {any}
   */
  data: any;
}

/**
 * Defines the structure of listener (callback) functions for user generated events (messages).
 *
 * **eventName** - The user event that has been triggered. Possible value are `user:signin`, `user:signout`, `user:update`, `user:delete`, `user:pwdchange`, `user:emailchange`, `user:phonechange`.
 *
 * **session** - The user session object that has triggered the event. If the event is triggered by the user without a session then this value will be `null`.
 * @export
 * @type ListenerFunction
 */
export type UserEventListenerFunction = (
  eventName: string,
  session: Session | null
) => void;
