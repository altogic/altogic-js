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
var _FileManager_bucketNameOrId, _FileManager_fileNameOrId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
const ClientError_1 = require("./utils/ClientError");
const DEFAULT_FILE_OPTIONS = {
    contentType: 'text/plain;charset=UTF-8',
};
/**
 * FileManager is primarily used to manage a file. Using the {@link BucketManager.file} method, you can create a FileManager instance for a specific file identified by its unique name or id.
 *
 * @export
 * @class FileManager
 */
class FileManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of FileManager to manage a specific bucket of your cloud storage
     * @param {string} bucketNameOfId The name or id of the bucket that this file is contained in
     * @param {string} fileNameOrId The name of id of the file that this file manager will be operating on
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(bucketNameOfId, fileNameOrId, fetcher) {
        super(fetcher);
        /**
         * The name or id of the bucket
         * @private
         * @type {string}
         */
        _FileManager_bucketNameOrId.set(this, void 0);
        /**
         * The name or id of the file
         * @private
         * @type {string}
         */
        _FileManager_fileNameOrId.set(this, void 0);
        __classPrivateFieldSet(this, _FileManager_bucketNameOrId, bucketNameOfId, "f");
        __classPrivateFieldSet(this, _FileManager_fileNameOrId, fileNameOrId, "f");
    }
    /**
     * Check if the file exists. It returns false if bucket does not exist, .
     *
     * @returns Returns true if file exists, false otherwise
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/exists`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Gets information about the file.
     *
     * @returns Returns basic file metadata informaton.
     */
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/get`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Sets the default privacy of the file to **true**.
     *
     * @returns Returns the updated file information
     */
    makePublic() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/make-public`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Sets the default privacy of the file to **false**.
     *
     * @returns Returns the updated file information
     */
    makePrivate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/make-private`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Downloads the file.
     *
     * @returns Returns the contents of the file in a `Blob`
     */
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/download`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            }, null, null, 'blob');
        });
    }
    /**
     * Renames the file.
     * @param {string} newName The new name of the file.
     * @throws Throws an exception if `newName` is not specified
     * @returns Returns the updated file information
     */
    rename(newName) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('new file name', newName);
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/rename`, {
                newName: newName,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Duplicates an existing file within the same bucket.
     *
     * @param {string} duplicateName The new duplicate file name. If not specified, uses the `fileName` as template and ensures the duplicated file name to be unique in its bucket.
     * @returns Returns the new duplicate file information
     */
    duplicate(duplicateName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/duplicate`, {
                duplicateName: duplicateName,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Deletes the file from the bucket.
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let { errors } = yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/delete`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
            return { errors };
        });
    }
    /**
     * Replaces an existing file with another. It keeps the name of the file but replaces file contents, encoding and mime-type with the newly uploaded file info.
     *
     * @param {string} fileBody The body of the new file that will be used to replace the existing file
     * @param {FileOptions} options Content type and privacy setting of the new file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to the bucket's privacy setting.
     * @throws Throws an exception if `fileBody` is not specified. Throws also an exception if `fileBody` is neither 'Blob' nor 'File' nor 'FormData' and if the `contentyType` option is not specified.
     * @returns Returns the metadata of the file after replacement
     */
    replace(fileBody, options) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('fileBody', fileBody);
            if ((typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
                (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
                (typeof File !== 'undefined' && fileBody instanceof File)) {
                return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/replace-formdata`, fileBody, {
                    file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                    bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
                    options: Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options),
                });
            }
            else {
                let optionsVal = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options);
                if (!optionsVal.contentType) {
                    throw new ClientError_1.ClientError('missing_content_type', "File body is neither 'Blob' nor 'File' nor 'FormData'. The contentType of the file body needs to be specified.");
                }
                return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/replace-object`, fileBody, {
                    file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                    bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
                    options: optionsVal,
                }, { 'Content-Type': optionsVal.contentType });
            }
        });
    }
    /**
     * Moves the file to another bucket. The file will be removed from its current bucket and will be moved to its new bucket. If there already exists a file with the same name in destination bucket, it ensures the moved file name to be unique in its new destination.
     *
     * @param {string} bucketNameOrId The name or id of the bucket to move the file into.
     * @throws Throws an exception if `bucketNameOrId` is not specified
     * @returns Returns the moved file information
     */
    moveTo(bucketNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('moved bucket name or id', bucketNameOrId);
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/move`, {
                bucketNameOrId: bucketNameOrId,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Copies the file to another bucket. If there already exists a file with the same name in destination bucket, it ensures the copied file name to be unique in its new destination.
     *
     * @param {string} bucketNameOrId The name or id of the bucket to copy the file into.
     * @throws Throws an exception if `bucketNameOrId` is not specified
     * @returns Returns the copied file information
     */
    copyTo(bucketNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('copied bucket name or id', bucketNameOrId);
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/copy`, {
                bucketNameOrId: bucketNameOrId,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
}
exports.FileManager = FileManager;
_FileManager_bucketNameOrId = new WeakMap(), _FileManager_fileNameOrId = new WeakMap();
//# sourceMappingURL=FileManager.js.map