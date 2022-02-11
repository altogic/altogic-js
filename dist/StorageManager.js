"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
const BucketManager_1 = require("./BucketManager");
const ClientError_1 = require("./utils/ClientError");
/**
 * Allows you manage your app's cloud storage buckets and files. With StorageManager you can create and list buckets and use the {@link BucketManager} to manage a specific bucket and and its contained files.
 *
 * You store your files, documents, images etc. under buckets, which are the basic containers that hold your application data. You typically create a bucket and upload files/objects to this bucket.
 *
 * When you deploy your app to an environment Altogic creates a default bucket called `root`. The `root` bucket helps you to group your app files that are not under any other bucket. Any file upload, which does not specify a bucket, is uploaded to the `root` bucket.
 *
 * You cannot rename or delete `root` bucket, but you can empty its contents and change its default privacy setting. By default the files contained in `root` bucket is publicly accessible through their URLs. You can change the default privacy setting of the `root` bucket using the {@link BucketManager.makePublic} or {@link BucketManager.makePrivate} methods.
 *
 *
 * @export
 * @class StorageManager
 */
class StorageManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of StorageManager to manage storage (i.e., files) of your application.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Creates a new {@link BucketManager} object for the specified bucket.
     *
     * Buckets are the basic containers that hold your application data (i.e., files). Everything that you store in your app storage must be contained in a bucket. You can use buckets to organize your data and control access to your data, but unlike directories and folders, you cannot nest buckets.
     *
     * Altogic automatically provides a default **`root`** bucket where you can store your files. You can pretty much do everthing with the **`root`** bucket that you can do with a normal bucket except you cannot delete or rename it.
     *
     * @param {string} nameOrId The name or id of the bucket.
     * @throws Throws an exception if `nameOrId` not specified
     * @returns Returns a new {@link BucketManager} object that will be used for managing the bucket
     */
    bucket(nameOrId) {
        (0, helpers_1.checkRequired)("bucket name or id", nameOrId);
        return new BucketManager_1.BucketManager(nameOrId, this.fetcher);
    }
    /**
     * Creates a new bucket. If there already exists a bucket with the specified name, it returns an error.
     *
     * Files can be specified as **public** or **private**, which defines how the public URL of the file will behave. If a file is marked as private then external apps/parties will not be able to access it through its public URL. With `isPublic` parameter of a bucket, you can specify default privacy setting of the files contained in this bucket, meaning that when you add a file to a bucket and if the file did not specify public/private setting, then the the bucket's privacy setting will be applied. You can always override the default privacy setting of a bucket at the individual file level.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} name The name of the bucket to create (case sensitive). `root` is a reserved name and cannot be used.
     * @param {boolean} isPublic The default privacy setting that will be applied to the files uploaded to this bucket.
     * @throws Throws an exception if `name` not specified
     * @returns Returns info about newly created bucket
     */
    createBucket(name, isPublic = true) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("Bucket name", name);
            return yield this.fetcher.post(`/_api/rest/v1/storage/create-bucket`, {
                name,
                isPublic,
            });
        });
    }
    /**
     * Gets the list of buckets in your app cloud storage. If query `expression` is specified, it runs the specified filter query to narrow down returned results, otherwise, returns all buckets contained in your app's cloud storage. You can use the following bucket fields in your query expressions.
     *
     * | Field name | Type | Desciption |
     * | :--- | :--- | :--- |
     * | _id | `text` *(`identifier`)* | Unique identifier of the file |
     * | name | `text` | Name of the bucket |
     * | isPublic | `boolean` | Default privacy setting that will be applied to files of the bucket |
     * | createdAt | `datetime` *(`text`)* | The creation date and time of the bucket |
     * | updatedAt | `datetime` *(`text`)* | The last modification date and time of bucket metadata |
     *
     * You can paginate through your buckets and sort them using the input {@link BucketListOptions} parameter.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} expression The query expression string that will be used to filter buckets
     * @param {BucketListOptions} options Options to configure how buckets will be listed, primarily used to set pagination and sorting settings
     * @throws Throws an exception (in case `expression` or `options` is specified) if `expression` is not a string or `options` is not an object
     * @returns Returns the array of matching buckets. If `returnCountInfo=true` in {@link BucketListOptions}, it returns an object which includes the count information and the matching buckets array.
     */
    listBuckets(expression, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let expVal = null;
            let optionsVal = null;
            if (expression) {
                if (typeof expression === "string")
                    expVal = expression;
                else if (typeof expression === "object")
                    optionsVal = expression;
                else
                    throw new ClientError_1.ClientError("invalid_value", `Bucket listing expression needs to be a string`);
            }
            if (options) {
                if (typeof options === "object")
                    optionsVal = options;
                else
                    throw new ClientError_1.ClientError("invalid_value", `Bucket listing options need to be an object`);
            }
            return yield this.fetcher.post(`/_api/rest/v1/storage/list-buckets`, {
                expression: expVal,
                options: optionsVal,
            });
        });
    }
    /**
     * Returns a {@link BucketManager} for the `root` bucket. It is equivalent to calling `bucket('root')`
     * @readonly
     * @type {BucketManager}
     */
    get root() {
        return new BucketManager_1.BucketManager("root", this.fetcher);
    }
    /**
     * Returns the overall information about your apps cloud storage including total number of buckets and files stored, total storage size in bytes and average, min and max file size in bytes.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @returns Returns information about your app's cloud storage
     */
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/stats`);
        });
    }
    /**
     * Gets the list of files matching the search expression. This method performs a global search across all the files contained in all the buckets. You can use the following file fields in your search expression.
     *
     * | Field name | Type | Description
     * | :--- | :--- | :--- |
     * | _id | `text` *(`identifier`)* | Unique identifier of the file |
     * | bucketId | `text` *(`identifier`)* | Identifier of the bucket |
     * | fileName | `text` | Name of the file |
     * | isPublic | `boolean` | Whether file is publicy accessible or not |
     * | size | `integer` | Size of the file in bytes |
     * | encoding | `text` | The encoding type of the file such as `7bit`, `utf8` |
     * | mimeType | `text` | The mime-type of the file such as `image/gif`, `text/html` |
     * | publicPath | `text` | The public path (URL) of the file |
     * | uploadedAt | `datetime` *(`text`)* | The upload date and time of the file |
     * | updatedAt | `datetime` *(`text`)* | The last modification date and time of file metadata |
     *
     * You can paginate through your files and sort them using the input {@link FileListOptions} parameter.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} expression The search expression string that will be used to filter file objects
     * @param {FileListOptions} options Pagination and sorting options
     * @throws Throws an exception if `expression` is not specified or `options` (if specified) is not an object
     * @returns Returns the files mathcing the search query. If `returnCountInfo=true` in {@link FileListOptions}, returns an object which includes count information and array of matching files.
     */
    searchFiles(expression, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let optionsVal = null;
            (0, helpers_1.checkRequired)("search expression", expression);
            if (options) {
                if (typeof options === "object")
                    optionsVal = options;
                else
                    throw new ClientError_1.ClientError("invalid_value", `File search options need to be an object`);
            }
            return yield this.fetcher.post(`/_api/rest/v1/storage/search-files`, {
                expression,
                options: optionsVal,
            });
        });
    }
}
exports.StorageManager = StorageManager;
//# sourceMappingURL=StorageManager.js.map