import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { QueryBuilder } from './QueryBuilder';
import { APIError } from './types';

/**
 * The database manager allows you manage your applications database. With DatabaseManager you can create new objects in your data model, update or delete existing ones, run queries and paginate over large data sets.
 *
 * @export
 * @class DatabaseManager
 */
export class DatabaseManager extends APIBase {
   /**
    * Creates an instance of DatabaseManager to manage data of your application.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      super(fetcher);
   }

   /**
    * Creates a new {@link QueryBuilder} for the specified model.
    *
    * In Altogic, models define the data structure and data validation rules of your applications. A model is composed of basic, advanced, and sub-model fields. As an analogy, you can think of models as tables and fields as columns in relational databases.
    *
    * You can specify a top-level model or a sub-model name for this method. As an example if you have a model named `users` where you keep your app users information you can create a {@link QueryBuilder} for `users` model by calling `altogic.db.model('users')`
    *
    * In case you need to work on a sub-model object, such as your users might have a list of addresses and these addresses are stored under a users object, you can create a {@link QueryBuilder} for `addresses` sub-model using the *dot-notation* by calling `altogic.db.model('users.addresses')`
    *
    * @param {string} name The name of the model
    * @returns Returns a new query builder object that will be issuing database commands (e.g., CRUD operations, queries) on the specified model
    */
   model(name: string): QueryBuilder {
      return new QueryBuilder(name, this.fetcher);
   }

   /**
    * Returns the overall information about your apps database and its models.
    *
    * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
    * @returns Returns information about your app's database
    */
   async getStats(): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.get(`/_api/rest/v1/db/stats`);
   }
}
