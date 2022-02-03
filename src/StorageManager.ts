import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { checkRequired, objectRequired } from './utils/helpers';
import { BucketManager } from './BucketManager';
import { APIError, BucketListOptions } from './types';
/**
 * Allows you manage your app's cloud storage buckets and files. With StorageManager you can create and list buckets and use the {@link BucketManager} to manage a specific bucket and and its contained files.
 *
 * @export
 * @class StorageManager
 */
export class StorageManager extends APIBase {
   /**
    * Creates an instance of StorageManager to manage storage (i.e., files) of your application.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      super(fetcher);
   }

   /**
    * Creates a new {@link BucketManager} object for the specified bucket.
    *
    * Buckets are the basic containers that hold your application data (i.e., files). Everything that you store in your app storage must be contained in a bucket. You can use buckets to organize your data and control access to your data, but unlike directories and folders, you cannot nest buckets.
    *
    * Algotic automatically provides a default **`root`** bucket where you can store your files. You can pretty much do everthing with a root bucket that you can do with a normal bucket except you cannot delete or rename a **`root`** bucket.
    *
    * @param {string} name The name of the bucket. `root` is a reserved name and used for the root bucket of your app environment storage
    * @returns Returns a new {@link BucketManager} object that will be used for managing the bucket
    */
   bucket(name: string): BucketManager {
      checkRequired('name', name);

      return new BucketManager(name, this.fetcher);
   }

   /**
    * Creates a new bucket. If there already exists a bucket with the specified name, it returns an error.
    *
    * Files can be specified as **public** or **private**, which defines how the public URL of the file will behave. If a file is marked as private then external apps/parties will not be able to access it through its public URL. With `isPublic` parameter of a bucket, you can specify default privacy setting of the files contained in this bucket, meaning that when you add a file to a bucket and if the file did not specify public/private setting, then the the bucket's privacy setting will be applied. You can always override the default privacy setting of a bucket at the individual file level.
    *
    * @param {string} name The name of the bucket to create (case sensitive). `root` is a reserved name and cannot be used.
    * @param {boolean} isPublic The name of the bucket to create (case sensitive). `root` is a reserved name and cannot be used.
    * @returns Returns info about newly created bucket
    */
   async createBucket(
      name: string,
      isPublic: boolean = true
   ): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('name', name);

      return await this.fetcher.post(`/_api/rest/v1/storage/create-bucket`, {
         name,
         isPublic,
      });
   }

   /**
    * Gets all the buckets of your app excluding the `root` bucket. You can paginate through your buckets using the {@link BucketListOptions}.
    *
    * @param {string} name The name of the bucket to create. `root` is a reserved name and cannot be used.
    * @returns Returns the array of buckets. If `returnCountInfo=true` in {@link BucketListOptions}, returns an object which includes count information and array of buckets.
    */
   async listBuckets(
      options?: BucketListOptions
   ): Promise<{ data: object | object[] | null; errors: APIError | null }> {
      if (options) objectRequired('options', options);

      return await this.fetcher.post(`/_api/rest/v1/storage/list-buckets`, {
         options,
      });
   }
}
