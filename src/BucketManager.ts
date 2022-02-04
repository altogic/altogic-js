import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, FileListOptions, FileUploadOptions } from './types';
import { checkRequired } from './utils/helpers';
import { ClientError } from './utils/ClientError';

const DEFAULT_FILE_OPTIONS = {
   contentType: 'text/plain;charset=UTF-8',
   isPublic: true,
};

/**
 * The query builder is primarily used to build database queries or run CRUD operataions on a model (i.e., table, collection) of your application.
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
   #bucketName: string;

   /**
    * Creates an instance of BucketManager to manage a specific bucket of your cloud storage
    * @param {string} name The name of the bucket that this bucket manager will be operating on
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(name: string, fetcher: Fetcher) {
      super(fetcher);
      this.#bucketName = name;
   }

   /**
    * Gets information about the bucket. If `detailed=true`, it provides additional information about the total number of files contained, their overall total size in bytes, average, min and max file size in bytes etc.
    *
    * @param {boolean} detailed Specifies whether to get detailed bucket statistics or not
    * @returns Returns basic bucket metadata informaton. If `detailed=true` provides additional information about contained files.
    */
   async get(detailed: boolean = false): Promise<{ data: object | null; errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/get`, {
         detailed: detailed,
         bucket: this.#bucketName,
      });
   }

   /**
    * Removes all objects (e.g., files) inside the bucket. This method does not delete the bucket itself. If you also want to delete the bucket, including all its contained objects, you can use {@link delete} method.
    */
   async empty(): Promise<{ errors: APIError | null }> {
      let { errors } = await this.fetcher.post(`/_api/rest/v1/storage/bucket/empty`, {
         bucket: this.#bucketName,
      });

      return { errors };
   }

   /**
    * Renames the bucket.
    * @param {string} newName The new name of the bucket. `root` is a reserved name and cannot be used.
    * @returns Returns the updated bucket information
    */
   async rename(newName: string): Promise<{ data: object | null; errors: APIError | null }> {
      if (this.#bucketName === 'root')
         throw new ClientError('invalid_operation', "'root' bucket cannot be renamed.");

      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/rename`, {
         newName: newName,
         bucket: this.#bucketName,
      });
   }

   /**
    * Deletes the bucket and all objects (e.g., files) inside the bucket.
    */
   async delete(): Promise<{ errors: APIError | null }> {
      if (this.#bucketName === 'root')
         throw new ClientError('invalid_operation', "'root' bucket cannot be deleted.");

      let { errors } = await this.fetcher.post(`/_api/rest/v1/storage/bucket/delete`, {
         bucket: this.#bucketName,
      });

      return { errors };
   }

   /**
    * Sets the default privacy of the bucket to **true**. You may also choose to make the contents of the bucket publicly readable by specifying `includeFiles=true`. This will automatically set `isPublic=true` for every file in the bucket.
    *
    * @param {boolean} includeFiles Specifies whether to make each file in the bucket public.
    */
   async makePublic(includeFiles: boolean = false): Promise<{ errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/make-public`, {
         includeFiles: includeFiles,
         bucket: this.#bucketName,
      });
   }

   /**
    * Sets the default privacy of the bucket to **false**. You may also choose to make the contents of the bucket private by specifying `includeFiles=true`. This will automatically set `isPublic=false` for every file in the bucket.
    *
    * @param {boolean} includeFiles Specifies whether to make each file in the bucket private.
    */
   async makePrivate(includeFiles: boolean = false): Promise<{ errors: APIError | null }> {
      return await this.fetcher.post(`/_api/rest/v1/storage/bucket/make-private`, {
         includeFiles: includeFiles,
         bucket: this.#bucketName,
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
    * | uploadedAt | `datetime` *(`text`)* | The upload date and time of the file |
    * | updatedAt | `datetime` *(`text`)* | The last modification date and time of file metadata |
    *
    * You can paginate through your files and sort them using the input {@link FileListOptions} parameter.
    *
    * @param {string} expression The query expression string that will be used to filter file objects
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
         bucket: this.#bucketName,
      });
   }

   /**
    * Uploads a file to an existing bucket.
    *
    * @param {string} filePath The relative path of the file. Should be either *filename.jpg* or if you have a folder structure *folder/subfolder/filename.jpg*
    * @param {string} fileBody The body of the file that will be stored in the bucket
    * @param {FileOptions} options Content type and privacy setting of the file. `contentType` is ignored, if `fileBody` is `Blob`, `File` or `FormData`, otherwise `contentType` option needs to be specified. If not specified, `contentType` will default to `text/plain;charset=UTF-8`. If `isPublic` is not specified, defaults to `true`.
    * @returns Returns the metadata of the uploaded file
    */
   async upload(
      filePath: string,
      fileBody: any,
      options: FileUploadOptions
   ): Promise<{ data: object | null; errors: APIError | null }> {
      checkRequired('filePath', filePath);
      checkRequired('fileBody', fileBody);

      if (
         (typeof FormData !== 'undefined' && fileBody instanceof FormData) ||
         (typeof Blob !== 'undefined' && fileBody instanceof Blob) ||
         (typeof File !== 'undefined' && fileBody instanceof File)
      ) {
         return await this.fetcher.post(`/_api/rest/v1/storage/bucket/upload-formdata`, fileBody, {
            filePath,
            options: { ...DEFAULT_FILE_OPTIONS, ...options },
         });
      } else {
         if (!options || !options.contentType) {
            throw new ClientError(
               'missing_content_type',
               "File body is neither 'Blob' nor 'File' nor 'FormData'. The contentType of the file body needs to be specified."
            );
         }

         return await this.fetcher.post(
            `/_api/rest/v1/storage/bucket/upload-object`,
            fileBody,
            {
               filePath,
               options: { ...DEFAULT_FILE_OPTIONS, ...options },
            },
            { 'Content-Type': options.contentType }
         );
      }
   }
}
