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
     * Creates an instance of FileManager to manage a specific bucket of your cloud storage.
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
     * Check if the file exists. It returns false if file does not exist.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
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
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
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
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
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
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
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
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
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
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} newName The new name of the file.
     * @returns Returns the updated file information
     */
    rename(newName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/rename`, {
                newName,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Duplicates an existing file within the same bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} duplicateName The new duplicate file name. If not specified, uses the `fileName` as template and ensures the duplicated file name to be unique in its bucket.
     * @returns Returns the new duplicate file information
     */
    duplicate(duplicateName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/duplicate`, {
                duplicateName,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Deletes the file from the bucket.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/delete`, {
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
            return { errors };
        });
    }
    /**
     * Replaces an existing file with another. It keeps the name of the file but replaces file contents, size, encoding and mime-type with the newly uploaded file info.
     *
     * If `onProgress` callback function is defined in {@link FileUploadOptions}, it periodically calls this function to inform about upload progress. Please note that for the moment **`onProgress` callback function can only be used in clients where `XMLHttpRequest` object is available (e.g., browsers).**
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {any} fileBody The body of the new file that will be used to replace the existing file
     * @param {FileOptions} options Content type and privacy setting of the new file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to the bucket's privacy setting.
     * @returns Returns the metadata of the file after replacement
     */
    replace(fileBody, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
                (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
                (typeof File !== 'undefined' && fileBody instanceof File)) {
                if (typeof XMLHttpRequest !== 'undefined' && (options === null || options === void 0 ? void 0 : options.onProgress)) {
                    return yield this.fetcher.upload(`/_api/rest/v1/storage/bucket/file/replace-formdata`, fileBody, {
                        bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
                        file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                        options: Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined }),
                    }, null, options.onProgress);
                }
                else {
                    return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/replace-formdata`, fileBody, {
                        bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
                        file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                        options: Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined }),
                    });
                }
            }
            else {
                const optionsVal = Object.assign(Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), options), { onProgress: undefined });
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
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} bucketNameOrId The name or id of the bucket to move the file into.
     * @returns Returns the moved file information
     */
    moveTo(bucketNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/move`, {
                bucketNameOrId,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
    /**
     * Copies the file to another bucket. If there already exists a file with the same name in destination bucket, it ensures the copied file name to be unique in its new destination.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} bucketNameOrId The name or id of the bucket to copy the file into.
     * @returns Returns the copied file information
     */
    copyTo(bucketNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/storage/bucket/file/copy`, {
                bucketNameOrId,
                file: __classPrivateFieldGet(this, _FileManager_fileNameOrId, "f"),
                bucket: __classPrivateFieldGet(this, _FileManager_bucketNameOrId, "f"),
            });
        });
    }
}
exports.FileManager = FileManager;
_FileManager_bucketNameOrId = new WeakMap(), _FileManager_fileNameOrId = new WeakMap();
//# sourceMappingURL=FileManager.js.map