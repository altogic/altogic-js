import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import {
  APIError,
  GetOptions,
  CreateOptions,
  SetOptions,
  AppendOptions,
  DeleteOptions,
  UpdateOptions,
  SimpleLookup,
  ComplexLookup,
  FieldUpdate,
} from "./types";
import { checkRequired, objectRequired } from "./utils/helpers";

const DEFAULT_GET_OPTIONS = { cache: "nocache" };
const DEFAULT_CREATE_OPTIONS = { cache: "nocache", returnTop: false };
const DEFAULT_SET_OPTIONS = { cache: "nocache", returnTop: false };
const DEFAULT_APPEND_OPTIONS = { cache: "nocache", returnTop: false };
const DEFAULT_DELETE_OPTIONS = { removeFromCache: true, returnTop: false };
const DEFAULT_UPDATE_OPTIONS = { cache: "nocache", returnTop: false };

/**
 * References an object stored in a specific model of your application. It provides the methods to get, update, delete an existing object identified by its id or create, set or append a new object.
 *
 * If id is provided when creatign an instance, you can use {@link get}, {@link update}, {@link delete} and {@link updateFields} methods. If no id specified in constructor, you can use {@link create}, {@link set}, and {@link append} methods to create a new object in the database.
 *
 * {@link create} method is used to creat a top-level object, which does not have any parent. {@link set} method is used to set the value of an `object` field of a parent object and finally {@link append} is used to add a child object to an `object-list` field of a parent object.
 *
 * Since both {@link set} and {@link append} operate on a sub-model or sub-model list object respectively, you need to pass a `parentId` as an input parameter.
 * @export
 * @class DBObject
 */
export class DBObject extends APIBase {
  /**
   * The name of the model that the db object will be operating on
   * @private
   * @type {string}
   */
  #modelName: string;

  /**
   * The unique identifier of the db object
   * @private
   * @type {string}
   */
  #id: string | undefined;

  /**
   * Creates an instance of DBObject
   * @param {string} modelName The name of the model that this query builder will be operating on
   * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
   * @param {string} id The unique identifier of the dbobject
   */
  constructor(modelName: string, fetcher: Fetcher, id?: string) {
    super(fetcher);
    this.#modelName = modelName;
    this.#id = id;
  }

  /**
   * Gets the object referred to by this db object and identified by the `id` from the database. If the `id` of the db object is not specified, it throws an exception.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {GetOptions} options Get operation options. By default no caching of the retrieved object in Redis store.
   * @returns Returns the object identified by the `id` or null if no such object exists in the database
   */
  async get(
    options?: GetOptions
  ): Promise<{ data: object | null; errors: APIError | null }>;
  /**
   * Gets the object referred to by this db object and identified by the `id` from the database. While getting the object it also performs the specified lookups. If the `id` of the db object is not specified, it throws an exception.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {[SimpleLookup | ComplexLookup]} lookups The list of lookups to make (left outer join) while getting the object from the database
   * @param {GetOptions} options Get operation options. By default no caching of the retrieved object in Redis store.
   * @throws Throws an exception if `id` is not specified
   * @returns Returns the object identified by the `id` or null if no such object exists in the database
   */
  async get(
    lookups: [SimpleLookup | ComplexLookup],
    options?: GetOptions
  ): Promise<{ data: object | null; errors: APIError | null }>;
  async get(
    optionsOrLookups?: [SimpleLookup | ComplexLookup] | GetOptions,
    options?: GetOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("id", this.#id);
    let lookupsVal = optionsOrLookups;
    let optionsVal = options;

    if (
      !Array.isArray(optionsOrLookups) &&
      typeof optionsOrLookups === "object"
    ) {
      optionsVal = optionsOrLookups;
      lookupsVal = undefined;
    }

    return await this.fetcher.post(`/_api/rest/v1/db/object/get`, {
      options: { ...DEFAULT_GET_OPTIONS, ...optionsVal },
      id: this.#id,
      lookups: lookupsVal,
      model: this.#modelName,
    });
  }

  /**
   * Creates a top level model object in the database. This method is valid only for **top-level models**, models without a parent. If this method is called for a sub-model object or object-list, an error will be returned.
   *
   * If the `id` is provided as input to this DBObject, its value will be ignored by this method since Altogic will automatically assign an id for new objects created in the database.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {object} values An object that contains the fields and their values to create in the database
   * @param {CreateOptions} options Create operation options. By default no caching of the newly created object in Redis store.
   * @throws Throws an exception if `values` is not specified
   * @returns Returns the newly create object in the database.
   */
  async create(
    values: object,
    options?: CreateOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("create values", values, false);

    return await this.fetcher.post(`/_api/rest/v1/db/object/create`, {
      values,
      options: { ...DEFAULT_CREATE_OPTIONS, ...options },
      id: this.#id,
      model: this.#modelName,
    });
  }

  /**
   * Sets the **object field** value of a parent object identified by `parentId`. This method is valid only for **sub-model objects**, objects with a parent. If this method is called for a top-level model object or sub-model object-list, an error will be returned.
   *
   * If the `id` is provided as input to this DBObject, its value will be ignored by this method since Altogic will automatically assign an id for new objects created in the database.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {object} values An object that contains the fields and their values to create in the database
   * @param {string} parentId the id of the parent object.
   * @param {SetOptions} options Create operation options. By default no caching of the newly created object in Redis store and no top level object return
   * @throws Throws an exception if `values` or `parentId` is not specified
   * @returns Returns the newly create object in the database.
   */
  async set(
    values: object,
    parentId: string,
    options?: SetOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("set values", values, false);
    checkRequired("set parentId", parentId);

    return await this.fetcher.post(`/_api/rest/v1/db/object/set`, {
      values,
      options: { ...DEFAULT_SET_OPTIONS, ...options },
      id: this.#id,
      parentId,
      model: this.#modelName,
    });
  }

  /**
   * Appends the input object to the **object list field** of a parent object identified by `parentId`. This method is valid only for **sub-model object-lists**, object-lists with a parent. If this method is called for a top-level model object or sub-model object, an error will be returned.
   *
   * If the `id` is provided as input to this DBObject, its value will be ignored by this method since Altogic will automatically assign an id for new objects created in the database.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {object} values An object that contains the fields and their values to create in the database
   * @param {string} parentId the id of the parent object.
   * @param {AppendOptions} options Create operation options. By default no caching of the newly created object in Redis store and no top level object return
   * @throws Throws an exception if `values` or `parentId` is not specified
   * @returns Returns the newly create object in the database.
   */
  async append(
    values: object,
    parentId: string,
    options?: AppendOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("append values", values, false);
    checkRequired("append parentId", parentId);

    return await this.fetcher.post(`/_api/rest/v1/db/object/append`, {
      values,
      options: { ...DEFAULT_APPEND_OPTIONS, ...options },
      id: this.#id,
      parentId,
      model: this.#modelName,
    });
  }

  /**
   * Deletes the document referred to by this DBObject and identified by the `id`. For a top level model object this method deletes the object from the database and for sub-model objects either unsets its value or removes it from its parent's object list. If the `id` of the db object is not defined, it throws an exception.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {DeleteOptions} options Delete operation options. By default removes deleted object from Redis cache (if cached already) and no top level object return.
   * @throws Throws an exception if `id` is not specified
   * @returns Returns null if the deleted object is a top-level object. If the deleted object is a sub-model object and if `returnTop` is set to true in {@link DeleteOptions}, it returns the updated top-level object.
   */
  async delete(
    options?: DeleteOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("id", this.#id);

    return await this.fetcher.post(`/_api/rest/v1/db/object/delete`, {
      options: { ...DEFAULT_DELETE_OPTIONS, ...options },
      id: this.#id,
      model: this.#modelName,
    });
  }

  /**
   * Updates the object referred to by this db object and identified by the `id` using the input values. This method directly sets the field values of the object in the database with the values provided in the input.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {object} values An object that contains the fields and their values to update in the database
   * @param {UpdateOptions} options Update operation options. By default no caching of the updated object in Redis store and no top level object return
   * @throws Throws an exception if `id` of db object or `values` is not specified
   * @returns Returns the updated object in the database. If `returnTop` is set to true in {@link UpdateOptions} and if the updated object is a sub-model or sub-model-list object, it returns the updated top-level object.
   */
  async update(
    values: object,
    options?: UpdateOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("update id", this.#id);
    objectRequired("update values", values);

    return await this.fetcher.post(`/_api/rest/v1/db/object/update`, {
      values,
      options: { ...DEFAULT_UPDATE_OPTIONS, ...options },
      id: this.#id,
      model: this.#modelName,
    });
  }

  /**
   * Updates the fields of object referred to by this db object and identified by the `id` using the input {@link FieldUpdate} instruction(s).
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {FieldUpdate | [FieldUpdate]} fieldUpdates Field update instruction(s)
   * @param {UpdateOptions} options Update operation options. By default no caching of the updated object in Redis store and no top level object return
   * @throws Throws an exception if `id` of db object or `fieldUpdates` is not specified
   * @returns Returns the updated object in the database. If `returnTop` is set to true in {@link UpdateOptions} and if the updated object is a sub-model or sub-model-list object, it returns the updated top-level object.
   */
  async updateFields(
    fieldUpdates: FieldUpdate | [FieldUpdate],
    options?: UpdateOptions
  ): Promise<{ data: object | null; errors: APIError | null }> {
    checkRequired("update id", this.#id);
    objectRequired("fieldUpdates", fieldUpdates);

    let updates = null;
    if (Array.isArray(fieldUpdates)) updates = fieldUpdates;
    else updates = [fieldUpdates];

    return await this.fetcher.post(`/_api/rest/v1/db/object/update-fields`, {
      updates,
      options: { ...DEFAULT_UPDATE_OPTIONS, ...options },
      id: this.#id,
      model: this.#modelName,
    });
  }
}
