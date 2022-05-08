import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import { APIError, FileUploadOptions } from "./types";

const DEFAULT_FILE_OPTIONS = {
  contentType: "text/plain;charset=UTF-8",
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
   * Creates an instance of FileManager to manage a specific bucket of your cloud storage.
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
   * Check if the file exists. It returns false if file does not exist.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns Returns true if file exists, false otherwise
   */
  async exists(): Promise<{ data: boolean | null; errors: APIError | null }> {
    return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/exists`, {
      file: this.#fileNameOrId,
      bucket: this.#bucketNameOrId,
    });
  }

  /**
   * Gets information about the file.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns Returns basic file metadata informaton.
   */
  async getInfo(): Promise<{ data: object | null; errors: APIError | null }> {
    return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/get`, {
      file: this.#fileNameOrId,
      bucket: this.#bucketNameOrId,
    });
  }

  /**
   * Sets the default privacy of the file to **true**.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns Returns the updated file information
   */
  async makePublic(): Promise<{
    data: object | null;
    errors: APIError | null;
  }> {
    return await this.fetcher.post(
      `/_api/rest/v1/storage/bucket/file/make-public`,
      {
        file: this.#fileNameOrId,
        bucket: this.#bucketNameOrId,
      }
    );
  }

  /**
   * Sets the default privacy of the file to **false**.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns Returns the updated file information
   */
  async makePrivate(): Promise<{
    data: object | null;
    errors: APIError | null;
  }> {
    return await this.fetcher.post(
      `/_api/rest/v1/storage/bucket/file/make-private`,
      {
        file: this.#fileNameOrId,
        bucket: this.#bucketNameOrId,
      }
    );
  }

  /**
   * Downloads the file.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns Returns the contents of the file in a `Blob`
   */
  async download(): Promise<{ data: Blob | null; errors: APIError | null }> {
    return await this.fetcher.post(
      `/_api/rest/v1/storage/bucket/file/download`,
      {
        file: this.#fileNameOrId,
        bucket: this.#bucketNameOrId,
      },
      null,
      null,
      "blob"
    );
  }

  /**
   * Renames the file.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} newName The new name of the file.
   * @returns Returns the updated file information
   */
  async rename(
    newName: string
  ): Promise<{ data: object | null; errors: APIError | null }> {
    return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/rename`, {
      newName,
      file: this.#fileNameOrId,
      bucket: this.#bucketNameOrId,
    });
  }

  /**
   * Duplicates an existing file within the same bucket.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} duplicateName The new duplicate file name. If not specified, uses the `fileName` as template and ensures the duplicated file name to be unique in its bucket.
   * @returns Returns the new duplicate file information
   */
  async duplicate(
    duplicateName?: string
  ): Promise<{ data: object | null; errors: APIError | null }> {
    return await this.fetcher.post(
      `/_api/rest/v1/storage/bucket/file/duplicate`,
      {
        duplicateName,
        file: this.#fileNameOrId,
        bucket: this.#bucketNameOrId,
      }
    );
  }

  /**
   * Deletes the file from the bucket.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   */
  async delete(): Promise<{ errors: APIError | null }> {
    const { errors } = await this.fetcher.post(
      `/_api/rest/v1/storage/bucket/file/delete`,
      {
        file: this.#fileNameOrId,
        bucket: this.#bucketNameOrId,
      }
    );

    return { errors };
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
  async replace(
    fileBody: any,
    options: FileUploadOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    if (
      (typeof FormData !== "undefined" && fileBody instanceof FormData) ||
      (typeof Blob !== "undefined" && fileBody instanceof Blob) ||
      (typeof File !== "undefined" && fileBody instanceof File)
    ) {
      if (typeof XMLHttpRequest !== "undefined" && options?.onProgress) {
        return await this.fetcher.upload(
          `/_api/rest/v1/storage/bucket/file/replace-formdata`,
          fileBody,
          {
            bucket: this.#bucketNameOrId,
            file: this.#fileNameOrId,
            options: {
              ...DEFAULT_FILE_OPTIONS,
              ...options,
              onProgress: undefined,
            },
          },
          null,
          options.onProgress
        );
      } else {
        return await this.fetcher.post(
          `/_api/rest/v1/storage/bucket/file/replace-formdata`,
          fileBody,
          {
            bucket: this.#bucketNameOrId,
            file: this.#fileNameOrId,
            options: {
              ...DEFAULT_FILE_OPTIONS,
              ...options,
              onProgress: undefined,
            },
          }
        );
      }
    } else {
      const optionsVal = {
        ...DEFAULT_FILE_OPTIONS,
        ...options,
        onProgress: undefined,
      };
      return await this.fetcher.post(
        `/_api/rest/v1/storage/bucket/file/replace-object`,
        fileBody,
        {
          file: this.#fileNameOrId,
          bucket: this.#bucketNameOrId,
          options: optionsVal,
        },
        { "Content-Type": optionsVal.contentType }
      );
    }
  }

  /**
   * Moves the file to another bucket. The file will be removed from its current bucket and will be moved to its new bucket. If there already exists a file with the same name in destination bucket, it ensures the moved file name to be unique in its new destination.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} bucketNameOrId The name or id of the bucket to move the file into.
   * @returns Returns the moved file information
   */
  async moveTo(
    bucketNameOrId: string
  ): Promise<{ data: object | null; errors: APIError | null }> {
    return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/move`, {
      bucketNameOrId,
      file: this.#fileNameOrId,
      bucket: this.#bucketNameOrId,
    });
  }

  /**
   * Copies the file to another bucket. If there already exists a file with the same name in destination bucket, it ensures the copied file name to be unique in its new destination.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} bucketNameOrId The name or id of the bucket to copy the file into.
   * @returns Returns the copied file information
   */
  async copyTo(
    bucketNameOrId: string
  ): Promise<{ data: object | null; errors: APIError | null }> {
    return await this.fetcher.post(`/_api/rest/v1/storage/bucket/file/copy`, {
      bucketNameOrId,
      file: this.#fileNameOrId,
      bucket: this.#bucketNameOrId,
    });
  }
}
