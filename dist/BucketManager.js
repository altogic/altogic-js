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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BucketManager_bucketNameOrId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
const ClientError_1 = require("./utils/ClientError");
const FileManager_1 = require("./FileManager");
const DEFAULT_FILE_OPTIONS = {
    contentType: 'text/plain;charset=UTF-8',
};
/**
 * BucketManager is primarily used to manage a bucket and its contents (e.g., files, documents, images). Using the {@link StorageManager.bucket} method, you can create a BucketManager instance for a specific bucket identified by its unique name or id.
 *
 * > Each object uploaded to a bucket needs to have a unique name. You cannot upload a file with the same name multiple times to a bucket.
 *
 * @export
 * @class BucketManager
 */
class BucketManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of BucketManager to manage a specific bucket of your cloud storage
     * @param {string} nameOrId The name or id of the bucket that this bucket manager will be operating on
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(nameOrId, fetcher) {
        super(fetcher);
        /**
         * The name of the bucket that the bucket manager will be operating on
         * @private
         * @type {string}
         */
        _BucketManager_bucketNameOrId.set(this, void 0);
        __classPrivateFieldSet(this, _BucketManager_bucketNameOrId, nameOrId, "f");
    }
    /**
     * Check if the bucket exists.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @returns Returns true if bucket exists, false otherwise
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f") === 'root')
                return { data: true, errors: null };
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/exists`, {
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Gets information about the bucket. If `detailed=true`, it provides additional information about the total number of files contained, their overall total size in bytes, average, min and max file size in bytes etc.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {boolean} detailed Specifies whether to get detailed bucket statistics or not
     * @returns Returns basic bucket metadata informaton. If `detailed=true` provides additional information about contained files.
     */
    getInfo(detailed = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/get`, {
                detailed,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Removes all objects (e.g., files) inside the bucket. This method does not delete the bucket itself. If you also want to delete the bucket, including all its contained objects, you can use {@link delete} method.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    empty() {
        return __awaiter(this, void 0, void 0, function* () {
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/storage/bucket/empty`, {
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
            return { errors };
        });
    }
    /**
     * Renames the bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} newName The new name of the bucket. `root` is a reserved name and cannot be used.
     * @throws Throws an exception if `newName` is not specified or `newName='root'`
     * @returns Returns the updated bucket information
     */
    rename(newName) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('new bucket name', newName);
            if (newName === 'root')
                throw new ClientError_1.ClientError('invalid_operation', "'root' is a reserved name and cannot be used to rename a bucket.");
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/rename`, {
                newName,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Deletes the bucket and all objects (e.g., files) inside the bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @throws Throws an exception if bucket is `root`
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f") === 'root')
                throw new ClientError_1.ClientError('invalid_operation', "'root' bucket cannot be deleted.");
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/storage/bucket/delete`, {
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
            return { errors };
        });
    }
    /**
     * Sets the default privacy of the bucket to **true**. You may also choose to make the contents of the bucket publicly readable by specifying `includeFiles=true`. This will automatically set `isPublic=true` for every file in the bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {boolean} includeFiles Specifies whether to make each file in the bucket public.
     * @returns Returns the updated bucket information
     */
    makePublic(includeFiles = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/make-public`, {
                includeFiles,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Sets the default privacy of the bucket to **false**. You may also choose to make the contents of the bucket private by specifying `includeFiles=true`. This will automatically set `isPublic=false` for every file in the bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {boolean} includeFiles Specifies whether to make each file in the bucket private.
     * @returns Returns the updated bucket information
     */
    makePrivate(includeFiles = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/make-private`, {
                includeFiles,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Gets the list of files stored in the bucket. If query `expression` is specified, it runs the specified filter query to narrow down returned results, otherwise, returns all files contained in the bucket. You can use the following file fields in your query expressions.
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
     * @param {string} expression The query expression string that will be used to filter file objects
     * @param {FileListOptions} options Pagination and sorting options
     * @throws Throws an exception if `expression` is not a string or `options` is not an object
     * @returns Returns the array of files. If `returnCountInfo=true` in {@link FileListOptions}, returns an object which includes count information and array of files.
     */
    listFiles(expression, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let expVal = null;
            let optionsVal = null;
            if (expression) {
                if (typeof expression === 'string')
                    expVal = expression;
                else if (typeof expression === 'object')
                    optionsVal = expression;
                else
                    throw new ClientError_1.ClientError('invalid_value', `File listing expression needs to be a string`);
            }
            if (options) {
                if (typeof options === 'object')
                    optionsVal = options;
                else
                    throw new ClientError_1.ClientError('invalid_value', `File listing options need to be an object`);
            }
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/list-files`, {
                expression: expVal,
                options: optionsVal,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Uploads a file to an existing bucket. If there already exists a file with the same name in destination bucket, it ensures the uploaded file name to be unique in its bucket.
     *
     * If `onProgress` callback function is defined in {@link FileUploadOptions}, it periodically calls this function to inform about upload progress. Please note that for the moment **`onProgress` callback function can only be used in clients where `XMLHttpRequest` object is available (e.g., browsers).**
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} fileName The name of the file e.g., *filename.jpg*
     * @param {string} fileBody The body of the file that will be stored in the bucket
     * @param {FileUploadOptions} options Content type and privacy setting of the file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to the bucket's privacy setting.
     * @throws Throws an exception if `fileName` or `fileBody` not specified. Throws also an exception if `fileBody` is neither 'Blob' nor 'File' nor 'FormData' and if the `contentyType` option is not specified.
     * @returns Returns the metadata of the uploaded file
     */
    upload(fileName, fileBody, options) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('fileName', fileName);
            (0, helpers_1.checkRequired)('fileBody', fileBody);
            if ((typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
                (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
                (typeof File !== 'undefined' && fileBody instanceof File)) {
                if (typeof XMLHttpRequest !== 'undefined' && (options === null || options === void 0 ? void 0 : options.onProgress)) {
                    return yield this.fetcher.upload(`/_api/rest/v1/storage/bucket/upload-formdata`, fileBody, {
                        bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
                        fileName,
                        options: Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined }),
                    }, null, options.onProgress);
                }
                else {
                    return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/upload-formdata`, fileBody, {
                        bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
                        fileName,
                        options: Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined }),
                    });
                }
            }
            else {
                const optionsVal = Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined });
                if (!optionsVal.contentType) {
                    throw new ClientError_1.ClientError('missing_content_type', "File body is neither 'Blob' nor 'File' nor 'FormData'. The contentType of the file body needs to be specified.");
                }
                return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/upload-object`, fileBody, {
                    bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
                    fileName,
                    options: optionsVal,
                }, { 'Content-Type': optionsVal.contentType });
            }
        });
    }
    /**
     * Creates a new {@link FileManager} object for the specified file.
     *
     * @param {string} fileNameOrId The name or id of the file.
     * @throws Throws an exception if `nameOrId` not specified
     * @returns Returns a new {@link FileManager} object that will be used for managing the file
     */
    file(fileNameOrId) {
        (0, helpers_1.checkRequired)('file name or id', fileNameOrId);
        return new FileManager_1.FileManager(__classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"), fileNameOrId, this.fetcher);
    }
    /**
     * Deletes multiple files identified either by their names or ids.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string[]} fileNamesOrIds Array of name or ids of the files to delete
     * @throws Throws an exception if no file name or id is specified
     */
    deleteFiles(fileNamesOrIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.arrayRequired)('array of file names/ids', fileNamesOrIds, true);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/storage/bucket/delete-files`, {
                fileNamesOrIds,
                bucket: __classPrivateFieldGet(this, _BucketManager_bucketNameOrId, "f"),
            });
            return { errors };
        });
    }
}
exports.BucketManager = BucketManager;
_BucketManager_bucketNameOrId = new WeakMap();
//# sourceMappingURL=BucketManager.js.map