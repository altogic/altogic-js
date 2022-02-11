"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIBase = void 0;
/**
 * The database manager allows you manage your applications data. With DatabaseManager you can create new objects in your data model, update or delete existing ones, run complex queries and paginate over large data sets.
 *
 * @export
 * @class DatabaseManager
 */
class APIBase {
    /**
     * Creates an instance of base class to access services exposed by Altogic
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher) {
        this.fetcher = fetcher;
    }
}
exports.APIBase = APIBase;
//# sourceMappingURL=APIBase.js.map