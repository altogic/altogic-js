import { Fetcher } from './utils/Fetcher';

/**
 * The base class where all manager classes are derived from.
 *
 * All manager classes interact with your app backend through the RESTful API and uses a {@link Fetcher} object. This base class keeps a reference to this fetcher object, and any class that is inherited from this base can use it.
 *
 * @export
 * @class DatabaseManager
 */
export class APIBase {
   /**
    * The http client to make RESTful API calls to the application's execution engine
    * @protected
    * @type {Fetcher}
    */
   protected fetcher: Fetcher;

   /**
    * Creates an instance of base class to access services exposed by Altogic
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      this.fetcher = fetcher;
   }
}
