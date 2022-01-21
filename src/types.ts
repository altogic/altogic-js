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
    * The unique app environment API Key which needs to be created using the Altogic app designer
    * @type {string}
    */
   apiKey?: string;

   /**
    * Client storage handler to store user and session data. By default uses Window.localStorage of the browser. If client is not a browser then you need to provide an object with setItem(key:string, data:object), getItem(key:string) and removeItem(key:string) methods to manage user and session data storage
    * @type Storage
    */
   localStorage?: ClientStorage;

   /**
    * The sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this sigin url.
    * @type {string}
    */
   signInRedirect?: string;
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
