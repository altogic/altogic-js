import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, FileListOptions, FileUploadOptions } from './types';
import { checkRequired } from './utils/helpers';
import { ClientError } from './utils/ClientError';

const DEFAULT_FILE_OPTIONS = {
   contentType: 'text/plain;charset=UTF-8',
};

/**
 * FileManager is primarily used to manage a file. Using the {@link BucketManager.file} method, you can create a FileManager instance for a specific file identified by its unique name or id.
 *
 * @export
 * @class FileManager
 */
export class FileManager extends APIBase {
   /**
    * The name or id of the bucket
    * @private
    * @type {string}
    */
   #bucketNameOrId: string;

   /**
    * The name or id of the file
    * @private
    * @type {string}
    */
   #fileNameOrId: string;

   /**
    * Creates an instance of FileManager to manage a specific bucket of your cloud storage
    * @param {string} bucketNameOfId The name or id of the bucket that this file is contained in
    * @param {string} fileNameOrId The name of id of the file that this file manager will be operating on
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(bucketNameOfId: string, fileNameOrId: string, fetcher: Fetcher) {
      super(fetcher);
      this.#bucketNameOrId = bucketNameOfId;
      this.#fileNameOrId = fileNameOrId;
   }

   /**
    * Gets information about the file.
    *
    * @returns Returns basic file metadata informaton.
    */
   async get(): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/get`, {
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Sets the default privacy of the file to **true**.
    *
    * @returns Returns the updated file information
    */
   async makePublic(): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/make-public`, {
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Sets the default privacy of the file to **false**.
    *
    * @returns Returns the updated file information
    */
   async makePrivate(): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/make-private`, {
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Downloads the file.
    *
    * @returns Returns the contents of the file in a `Blob`
    */
   async download(): Promise<{ data: Blob | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/download`, {
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Renames the file.
    * @param {string} newName The new name of the file.
    * @throws Throws an exception if `newName` is not specified
    * @returns Returns the updated file information
    */
   async rename(newName: string): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('new file name', newName);

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/rename`, {
         newName: newName,
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Duplicates an existing file. If the `duplicateName` is not specified, automatically creates a new name for the file
    *
    * @param {string} [duplicateName] The new duplicate file name
    * @returns Returns the new duplicate file information
    */
   async duplicate(
      duplicateName?: string
   ): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/duplicate`, {
         duplicateName: duplicateName,
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Deletes the file.
    */
   async delete(): Promise<{ errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/delete`, {
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Replaces an existing file with another.
    *
    * @param {string} fileBody The body of the new file that will be used to replace the existing file
    * @param {FileOptions} options Content type and privacy setting of the new file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to the bucket's privacy setting.
    * @throws Throws an exception if `fileBody` is not specified. Throws also an exception if `fileBody` is neither 'Blob' nor 'File' nor 'FormData' and if the `contentyType` option is not specified.
    * @returns Returns the metadata of the file after replacement
    */
   async replace(
      fileBody: any,
      options: FileUploadOptions
   ): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('fileBody', fileBody);

      if (
         (typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
         (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
         (typeof File !== 'undefined' && fileBody instanceof File)
      ) {
         return await this.fetcher.post(
            `/_api/rest/v1/storage/bucket/file/replace-formdata`,
            fileBody,
            {
               bucket: this.#bucketNameOrId,
               options: { ...DEFAULT_FILE_OPTIONS, ...options },
            }
         );
      } else {
         let optionsVal = { ...DEFAULT_FILE_OPTIONS, ...options };
         if (!optionsVal.contentType) {
            throw new ClientError(
               'missing_content_type',
               "File body is neither 'Blob' nor 'File' nor 'FormData'. The contentType of the file body needs to be specified."
            );
         }

         return await this.fetcher.post(
            `/_api/rest/v1/storage/bucket/file/replace-object`,
            fileBody,
            {
               bucket: this.#bucketNameOrId,
               options: optionsVal,
            },
            { 'Content-Type': optionsVal.contentType }
         );
      }
   }

   /**
    * Moves the file to another bucket.
    *
    * @param {string} bucketNameOrId The name or id of the bucket to move the file into.
    * @throws Throws an exception if `bucketNameOrId` is not specified
    * @returns Returns the updated file information
    */
   async move(bucketNameOrId: string): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('moved bucket name or id', bucketNameOrId);

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/move`, {
         bucketNameOrId: bucketNameOrId,
         file: this.#fileNameOrId,
         bucket: this.#bucketNameOrId,
      });
   }
}
