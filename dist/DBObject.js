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
var _DBObject_modelName, _DBObject_id;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBObject = void 0;
const APIBase_1 = require("./APIBase");
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
class DBObject extends APIBase_1.APIBase {
    /**
     * Creates an instance of DBObject
     * @param {string} modelName The name of the model that this query builder will be operating on
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     * @param {string} id The unique identifier of the dbobject
     */
    constructor(modelName, fetcher, id) {
        super(fetcher);
        /**
         * The name of the model that the db object will be operating on
         * @private
         * @type {string}
         */
        _DBObject_modelName.set(this, void 0);
        /**
         * The unique identifier of the db object
         * @private
         * @type {string}
         */
        _DBObject_id.set(this, void 0);
        __classPrivateFieldSet(this, _DBObject_modelName, modelName, "f");
        __classPrivateFieldSet(this, _DBObject_id, id, "f");
    }
    get(optionsOrLookups, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let lookupsVal = optionsOrLookups;
            let optionsVal = options;
            if (!Array.isArray(optionsOrLookups) &&
                typeof optionsOrLookups === "object") {
                optionsVal = optionsOrLookups;
                lookupsVal = undefined;
            }
            return yield this.fetcher.post(`/_api/rest/v1/db/object/get`, {
                options: Object.assign(Object.assign({}, DEFAULT_GET_OPTIONS), optionsVal),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                lookups: lookupsVal,
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
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
     * @returns Returns the newly create object in the database.
     */
    create(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/object/create`, {
                values,
                options: Object.assign(Object.assign({}, DEFAULT_CREATE_OPTIONS), options),
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
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
     * @returns Returns the newly create object in the database.
     */
    set(values, parentId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/object/set`, {
                values,
                options: Object.assign(Object.assign({}, DEFAULT_SET_OPTIONS), options),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                parentId,
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
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
     * @returns Returns the newly create object in the database.
     */
    append(values, parentId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/object/append`, {
                values,
                options: Object.assign(Object.assign({}, DEFAULT_APPEND_OPTIONS), options),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                parentId,
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
        });
    }
    /**
     * Deletes the document referred to by this DBObject and identified by the `id`. For a top level model object this method deletes the object from the database and for sub-model objects either unsets its value or removes it from its parent's object list. If the `id` of the db object is not defined, it returns an error.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {DeleteOptions} options Delete operation options. By default removes deleted object from Redis cache (if cached already) and no top level object return.
     * @returns Returns null if the deleted object is a top-level object. If the deleted object is a sub-model object and if `returnTop` is set to true in {@link DeleteOptions}, it returns the updated top-level object.
     */
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/object/delete`, {
                options: Object.assign(Object.assign({}, DEFAULT_DELETE_OPTIONS), options),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
        });
    }
    /**
     * Updates the object referred to by this db object and identified by the `id` using the input values. This method directly sets the field values of the object in the database with the values provided in the input.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {object} values An object that contains the fields and their values to update in the database
     * @param {UpdateOptions} options Update operation options. By default no caching of the updated object in Redis store and no top level object return
     * @returns Returns the updated object in the database. If `returnTop` is set to true in {@link UpdateOptions} and if the updated object is a sub-model or sub-model-list object, it returns the updated top-level object.
     */
    update(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/object/update`, {
                values,
                options: Object.assign(Object.assign({}, DEFAULT_UPDATE_OPTIONS), options),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
        });
    }
    /**
     * Updates the fields of object referred to by this db object and identified by the `id` using the input {@link FieldUpdate} instruction(s).
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {FieldUpdate | [FieldUpdate]} fieldUpdates Field update instruction(s)
     * @param {UpdateOptions} options Update operation options. By default no caching of the updated object in Redis store and no top level object return
     * @returns Returns the updated object in the database. If `returnTop` is set to true in {@link UpdateOptions} and if the updated object is a sub-model or sub-model-list object, it returns the updated top-level object.
     */
    updateFields(fieldUpdates, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let updates = null;
            if (Array.isArray(fieldUpdates))
                updates = fieldUpdates;
            else
                updates = [fieldUpdates];
            return yield this.fetcher.post(`/_api/rest/v1/db/object/update-fields`, {
                updates,
                options: Object.assign(Object.assign({}, DEFAULT_UPDATE_OPTIONS), options),
                id: __classPrivateFieldGet(this, _DBObject_id, "f"),
                model: __classPrivateFieldGet(this, _DBObject_modelName, "f"),
            });
        });
    }
}
exports.DBObject = DBObject;
_DBObject_modelName = new WeakMap(), _DBObject_id = new WeakMap();
//# sourceMappingURL=DBObject.js.map