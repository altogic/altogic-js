import { Fetcher } from './utils/Fetcher';

/**
 * The database manager allows you manage your applications data. With DatabaseManager you can create new objects in your data model, update or delete existing ones, run complex queries and paginate over large data sets.
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
