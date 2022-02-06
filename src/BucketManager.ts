import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, FileListOptions, FileUploadOptions } from './types';
import { checkRequired, arrayRequired } from './utils/helpers';
import { ClientError } from './utils/ClientError';
import { FileManager } from './FileManager';

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
export class BucketManager extends APIBase {
   /**
    * The name of the bucket that the bucket manager will be operating on
    * @private
    * @type {string}
    */
   #bucketNameOrId: string;

   /**
    * Creates an instance of BucketManager to manage a specific bucket of your cloud storage
    * @param {string} nameOrId The name or id of the bucket that this bucket manager will be operating on
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(nameOrId: string, fetcher: Fetcher) {
      super(fetcher);
      this.#bucketNameOrId = nameOrId;
   }

   /**
    * Check if the bucket exists.
    *
    * @returns Returns true if bucket exists, false otherwise
    */
   async exists(): Promise<{ data: boolean | null; errors: APIError | null }> {
      if (this.#bucketNameOrId === 'root') return { data: true, errors: null };

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/exists`, {
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Gets information about the bucket. If `detailed=true`, it provides additional information about the total number of files contained, their overall total size in bytes, average, min and max file size in bytes etc.
    *
    * @param {boolean} detailed Specifies whether to get detailed bucket statistics or not
    * @returns Returns basic bucket metadata informaton. If `detailed=true` provides additional information about contained files.
    */
   async getInfo(
      detailed: boolean = false
   ): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/get`, {
         detailed: detailed,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Removes all objects (e.g., files) inside the bucket. This method does not delete the bucket itself. If you also want to delete the bucket, including all its contained objects, you can use {@link delete} method.
    */
   async empty(): Promise<{ errors: APIError | null }> {
      let { errors } = await this.fetcher.post(`/_api/rest/v1/storage/bucket/empty`, {
         bucket: this.#bucketNameOrId,
      });

      return { errors };
   }

   /**
    * Renames the bucket.
    * @param {string} newName The new name of the bucket. `root` is a reserved name and cannot be used.
    * @throws Throws an exception if `newName` is not specified or `newName='root'`
    * @returns Returns the updated bucket information
    */
   async rename(newName: string): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('new bucket name', newName);
      if (newName === 'root')
         throw new ClientError(
            'invalid_operation',
            "'root' is a reserved name and cannot be used to rename a bucket."
         );

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/rename`, {
         newName: newName,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Deletes the bucket and all objects (e.g., files) inside the bucket.
    * @throws Throws an exception if bucket is `root`
    */
   async delete(): Promise<{ errors: APIError | null }> {
      if (this.#bucketNameOrId === 'root')
         throw new ClientError('invalid_operation', "'root' bucket cannot be deleted.");

      let { errors } = await this.fetcher.post(`/_api/rest/v1/storage/bucket/delete`, {
         bucket: this.#bucketNameOrId,
      });

      return { errors };
   }

   /**
    * Sets the default privacy of the bucket to **true**. You may also choose to make the contents of the bucket publicly readable by specifying `includeFiles=true`. This will automatically set `isPublic=true` for every file in the bucket.
    *
    * @param {boolean} includeFiles Specifies whether to make each file in the bucket public.
    * @returns Returns the updated bucket information
    */
   async makePublic(
      includeFiles: boolean = false
   ): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/make-public`, {
         includeFiles: includeFiles,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Sets the default privacy of the bucket to **false**. You may also choose to make the contents of the bucket private by specifying `includeFiles=true`. This will automatically set `isPublic=false` for every file in the bucket.
    *
    * @param {boolean} includeFiles Specifies whether to make each file in the bucket private.
    * @returns Returns the updated bucket information
    */
   async makePrivate(
      includeFiles: boolean = false
   ): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/make-private`, {
         includeFiles: includeFiles,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Gets the list of files matching the query expression. If query `expression` is specified, it runs the specified filter query to narrow down returned results, otherwise, returns all files contained in the bucket. You can use the following file fields in your query expressions.
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
    * @param {string} expression The query expression string that will be used to filter file objects
    * @param {FileListOptions} options Pagination and sorting options
    * @throws Throws an exception if `expression` is not a string or `options` is not an object
    * @returns Returns the array of files. If `returnCountInfo=true` in {@link FileListOptions}, returns an object which includes count information and array of files.
    */
   async listFiles(
      expression?: string,
      options?: FileListOptions
   ): Promise<{ data: object | object[] | null; errors: APIError | null }> {
      let expVal = null;
      let optionsVal = null;

      if (expression) {
         if (typeof expression === 'string') expVal = expression;
         else if (typeof expression === 'object') optionsVal = expression;
         else
            throw new ClientError('invalid_value', `File listing expression needs to be a string`);
      }

      if (options) {
         if (typeof options === 'object') optionsVal = options;
         else throw new ClientError('invalid_value', `File listing options need to be an object`);
      }

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/list-files`, {
         expression: expVal,
         options: optionsVal,
         bucket: this.#bucketNameOrId,
      });
   }

   /**
    * Uploads a file to an existing bucket. If there already exists a file with the same name in destination bucket, it ensures the uploaded file name to be unique in its bucket.
    *
    * @param {string} fileName The name of the file e.g., *filename.jpg*
    * @param {string} fileBody The body of the file that will be stored in the bucket
    * @param {FileOptions} options Content type and privacy setting of the file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to the bucket's privacy setting.
    * @throws Throws an exception if `fileName` or `fileBody` not specified. Throws also an exception if `fileBody` is neither 'Blob' nor 'File' nor 'FormData' and if the `contentyType` option is not specified.
    * @returns Returns the metadata of the uploaded file
    */
   async upload(
      fileName: string,
      fileBody: any,
      options: FileUploadOptions
   ): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('fileName', fileName);
      checkRequired('fileBody', fileBody);

      if (
         (typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
         (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
         (typeof File !== 'undefined' && fileBody instanceof File)
      ) {
         return await this.fetcher.post(`/_api/rest/v1/storage/bucket/upload-formdata`, fileBody, {
            bucket: this.#bucketNameOrId,
            fileName,
            options: { ...DEFAULT_FILE_OPTIONS, ...options },
         });
      } else {
         let optionsVal = { ...DEFAULT_FILE_OPTIONS, ...options };
         if (!optionsVal.contentType) {
            throw new ClientError(
               'missing_content_type',
               "File body is neither 'Blob' nor 'File' nor 'FormData'. The contentType of the file body needs to be specified."
            );
         }

         return await this.fetcher.post(
            `/_api/rest/v1/storage/bucket/upload-object`,
            fileBody,
            {
               bucket: this.#bucketNameOrId,
               fileName,
               options: optionsVal,
            },
            { 'Content-Type': optionsVal.contentType }
         );
      }
   }

   /**
    * Creates a new {@link FileManager} object for the specified file.
    *
    * @param {string} fileNameOrId The name or id of the file.
    * @throws Throws an exception if `nameOrId` not specified
    * @returns Returns a new {@link FileManager} object that will be used for managing the file
    */
   file(fileNameOrId: string): FileManager {
      checkRequired('file name or id', fileNameOrId);

      return new FileManager(this.#bucketNameOrId, fileNameOrId, this.fetcher);
   }

   /**
    * Deletes multiple files identified either by their names or ids.
    *
    * @param {string[]} fileNamesOrIds Array of name or ids of the files to delete
    * @throws Throws an exception if no file name or id is specified
    */
   async deleteFiles(fileNamesOrIds: string[]): Promise<{ errors: APIError | null }> {
      arrayRequired('array of file names/ids', fileNamesOrIds, true);

      let { errors } = await this.fetcher.post(`/_api/rest/v1/storage/bucket/delete-files`, {
         fileNamesOrIds: fileNamesOrIds,
         bucket: this.#bucketNameOrId,
      });

      return { errors };
   }
}
