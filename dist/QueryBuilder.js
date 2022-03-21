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
var _QueryBuilder_modelName, _QueryBuilder_action;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const APIBase_1 = require("./APIBase");
const DBObject_1 = require("./DBObject");
const helpers_1 = require("./utils/helpers");
const ClientError_1 = require("./utils/ClientError");
/**
 * The query builder is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * There are several modifiers (e.g., filter, lookup, omit, sort, limit, page) that you can use to build your queries. For convenience, these modifiers can be chained to build complex queries. As an example, assuming that you have a userOrders model where you keep orders of your users, you can create the following query by chaining multiple modifiers to get the first 100 orders with basket size greater than 50 and sorted by orderDate descending.
 * ```
 * const { data, errors } = await altogic.db
 *    .model('userOrders')
 *    .filter('basketSize > 50')
 *    .sort('orderDate', 'desc')
 *    .limit(100)
 *    .page(1)
 *    .get();
 * ```
 *
 * @export
 * @class QueryBuilder
 */
class QueryBuilder extends APIBase_1.APIBase {
    /**
     * Creates an instance of QueryBuilder to run queries and CRUD operations on your app's database.
     * @param {string} name The name of the model that this query builder will be operating on
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(name, fetcher) {
        super(fetcher);
        /**
         * The name of the model that the query builder will be operating on
         * @private
         * @type {string}
         */
        _QueryBuilder_modelName.set(this, void 0);
        /**
         * The action object that will be sent to your app to query data, create, update or delete objects in the database. When you use filter, order, page, limit etc. methods, the action object will be populated with respective entries.
         * @type {DBAction}
         */
        _QueryBuilder_action.set(this, void 0);
        __classPrivateFieldSet(this, _QueryBuilder_modelName, name, "f");
        __classPrivateFieldSet(this, _QueryBuilder_action, {
            expression: null,
            lookups: null,
            page: null,
            limit: null,
            sort: null,
            omit: null,
            group: null,
        }, "f");
    }
    /**
     * Gets a {@link DBObject} instance that refers to the object with the specified id.
     *
     * {@link DBObject} provides convenience methods to perform create, update, delete, get and upsert operations.
     *
     * @param {string} [id] The unique identifier of the object that is stored in the database
     * @returns A DBObject instance
     */
    object(id) {
        return new DBObject_1.DBObject(__classPrivateFieldGet(this, _QueryBuilder_modelName, "f"), this.fetcher, id);
    }
    /**
     * Sets the query expression for selecting/filtering data from your app's database.
     *
     * If multiple filter method calls are chained then the last one overwrites the previous filters.
     *
     * ### Expressions
     *
     * Expressions enable the creation of **logical**, **mathematical** and **relational** **statements**, which are used to apply rules, perform mathematical calculations on retrieved data, compare model objects and check the feasibility of a statement. **Expressions are also used to access data of model objects.**
     *
     * The basic expression types implemented by Altogic platform can be summarized as follows:
     *
     * * Mathematical
     * * Logical
     * * Relational
     * * Informational \(data retrieval from model objects\)
     *
     * **Expressions are defined as combinations of operands and operators in a logical sequence.** Such a sequence may represent a mathematical calculation, logical reasoning, relational comparison or even an informational operation. ****Below are some expression examples.
     *
     * > 1. ```
     * >    10 - 5
     * >    ```
     * > 2. ```
     * >    (100 - 20) * 8
     * >    ```
     * > 3. ```
     * >    'Altogic' + '-' + 'Backend as a service platform'
     * >    ```
     * > 4. ```
     * >    (shoppingCart.totalPrice / SIZE(shoppingCart.items)) > 25
     * >    ```
     *
     * The first expression above is a mathematical expression, the second one is again a mathematical expression but it is nested. The third one is a string manipulation expression and the last one is a combination of relational, informational and mathematical expressions, including the use of `SIZE` function. This last expression checks whether the average price of an item in an imaginary shopping cart object is greater than 25 or not. As seen from the above examples, the expression types and combinations may differ from one expression to another, however, **the main rule is to keep combinations and types similar to each other**. That is the results of the expression operands evaluation, namely the values, must be of the same type to have a proper operator implementation.
     *
     * Expressions consist of **operands** and **operators**. An operand can be a **basic value** or an expression defined in terms of other expressions because expressions can be treated as recursive data structures.
     *
     * ### **Values**
     *
     * Each expression is formed by logically combining values. Values are actually primitive data types, but more complex data types such as lists and geo-points can also be used in expressions. A value can be a:
     *
     * | Value type | Examples |
     * | :--- | :--- |
     * | Boolean | `true` `false` |
     * | Number | `134` `56.98` |
     * | Text | `'Hello world!'` |
     * | Datetime | `'2020-04-01T06:40:12.941+00:00'` |
     * | List \(array of basic values\) | `['pop', '90s', 'urban', 'dance']` |
     * | Geo-point \(longitude and latitude\) | `[29.032589793205258, 41.2200826257151]` |
     * | Model field value | `profile.email` `address.city` |
     *
     * ### **Operators**
     *
     * Operators carry out all the computations by using the expression elements and can be classified into two main categories. They can be either **unary** or **binary**.
     *
     * **Unary operators** carry the calculations on a **single value**, namely on an operand, however, **binary operators** carry calculations on **two operands**, one on the left of the operator \(left operand\) and the other on the right \(right operand\).
     *
     * #### **Arithmetic operators**
     *
     * Arithmetic operators are used for mathematical calculations.
     *
     * | **Operator** | **Syntax** | **Description** |
     * | :--- | :--- | :--- |
     * | + \(unary\) | + Expression | Assigns a positive sign to expression |
     * | + | Expression + expression | Adds the values |
     * | - \(unary\) | - Expression | Assigns a negative sign to expression value |
     * | - | Expression – expression | Subtracts the values |
     * | \* | Expression \* expression | Multiplies the values |
     * | / | Expression / expression | Divides the values |
     *
     * > **Example:**
     * >
     * > ```
     * > -(10 + ((10 * 5 - 4) / 100 - 20))
     * > ```
     *
     * In the above expression, all the arithmetic operators are used. The expression is purely mathematical and it is nested. Moreover, the evaluation result of the expression value sign is converted to negative type by the unary minus operator.
     *
     * #### **Logical operators**
     *
     * Logical operators are used to evaluating an expression to **true** \(1\) or **false** \(0\).
     *
     * | **Operator** | **Syntax** | **Description** |
     * | :--- | :--- | :--- |
     * | && | Expression && expression | Logical AND returns true \(1\) only if both expressions evaluate to a nonzero value; otherwise it returns false \(0\). |
     * | \|\| | Expression \|\| expression | Logical OR returns true \(1\) if either of the expressions evaluates to a nonzero value; otherwise it returns false \(0\). |
     * | ! | !Expression | Logical negation returns false \(0\) if the expression evaluates to a nonzero value; otherwise it returns true \(1\). |
     *
     * > **Example:**
     * >
     * > ```
     * > (profile.firstName && profile.lastName) || profile.fullName
     * > ```
     *
     * As it can be seen that the expression uses a combination of both logical && and \|\| operators. It uses three field values of an imaginary 'profile' model. Initially, the expression in parenthesis will be evaluated, which performs a logical AND conditioning on the first two attributes. The result obtained from this evaluation will next be combined with the evaluation result of the last expression operand \(profile.fullName\) and the final result will be either evaluated to true or false.
     *
     * Instead of the logical operators, you can also use **AND** function for &&, **OR** function for \|\| and NOT function for ! operator. Using the functions instead of operators the above example can be written as:
     *
     * ```
     * OR(AND(profile.firstName, profile.lastName), profile.fullName)
     * ```
     *
     * #### **Relational operators**
     *
     * Like logical operators, relational operators are also used to evaluate an expression to **true** \(1\) or **false** \(0\).
     *
     * | **Operator** | **Syntax** | **Description** |
     * | :--- | :--- | :--- |
     * | == | Expression == expression | Checks equality of expressions; if the expressions are equal, it returns true \(1\) otherwise, it returns false \(0\) |
     * | != | Expression != expression | Checks not equality of expressions; if the expressions are not equal, it returns true \(1\) otherwise, it returns false \(0\) |
     * | &lt; | Expression &lt; expression | Checks whether the first expression is less than the second one; if the first expression is less than the second one, returns true \(1\) otherwise, it returns false \(0\) |
     * | &gt; | Expression &gt; expression | Checks whether the first expression is greater than the second one; if the first expression is greater than the second one, returns true \(1\) otherwise, it returns false \(0\) |
     * | &lt;= | Expression &lt;= expression | Checks whether the first expression is less than or equal to the second one; if the first expression is less than or equal to the second one, returns true \(1\) otherwise, it returns false \(0\) |
     * | &gt;= | Expression &gt;= expression | Checks whether the first expression is greater than or equal to the second one; if the first expression is greater than or equal to the second one, returns true \(1\) otherwise, it returns false \(0\) |
     *
     * > **Example:**
     * >
     * > ```
     * > task.completionDate > task.dueDate
     * > ```
     *
     * The expression above uses a relational greater than operator. It checks whether the completion time is later than the due date of an imaginary task object.
     *
     * #### Altogic specific operators
     *
     * | **Operator** | **Syntax** | **Description** |
     * | :--- | :--- | :--- |
     * | \[ \] | \[expression, expression, ...\] | This bracket operator specifies that the expressions which are separated by commas between the brackets are members of a list \(array\) |
     * | " " | "text" | This operator specifies that the expression between the double quotation is a text value. |
     * | ' ' | 'text' | This operator specifies that the expression between the quotation is a text value. |
     *
     * > **Examples:**
     * >
     * > 1. ```
     * >    '10' + '20' + '30'
     * >    ```
     * > 2. ```
     * >    'Result : ' + (10 * 5 + 100)
     * >    ```
     * > 3. ```
     * >    SIZE([45,26,94,73]) == 4
     * >    ```
     *
     * The first expression illustrates a basic string concatenation operation. The characters between the double quotes are treated as a string. The second and the third strings are concatenated to the first one, which results in this final string: `102030`. The second expression is a special one and evaluation result of this expression is `Result : 150`. This is again a string concatenation operation but the second expression is evaluated as a mathematical one and the result is converted to a string value. The last expression is a relational equality check whether the left operand value is equal to the right operand value. `size` is a built in function which returns the length of an array. In this case the array length is 4 and this overall expression evaluates to true \(1\).
     *
     * ### **Associativity and Precedence of Operators**
     *
     * In expressions, operators have different precedence. Evaluation of the expressions is carried on according to the precedence of the operators. From simple algebra, multiplication precedes addition or subtraction, however division and multiplication have the same precedence.
     *
     * The precedence relation between the arithmetical, logical, special and relational operators implemented is as follows.
     *
     * | **Operators** | **Associativity** |
     * | :--- | :--- |
     * | \( \) " ' \[ \] | Left to right |
     * | + - ! | Left to right |
     * | \* / | Left to right |
     * | + - | Left to right |
     * | &lt; &lt;= &gt; &gt;= | Left to right |
     * | == != | Left to right |
     * | && | Left to right |
     * | \|\| | Left to right |
     *
     * Operators in the same category have equal precedence with each other. Where duplicates of operators appear in the table, the first occurrence is unary, the second binary. Each category has an associativity rule: left to right. In the absence of parentheses, this rule resolves the grouping of expressions with operators of equal precedence. The precedence of each operator in table above is indicated by its order in the table. The first category \(on the first line\) has the highest precedence. Operators on the same line have equal precedence.
     *
     * ### Functions
     *
     * There are several **array**, **logical**, **text**, **object**, **mathematical**, **date & time**, **type conversion**, **validation** and **geolocation** functions implemented as expressions for performing advanced calculations and data manipulations. You can use these functions in your expressions.
     *
     * Each function has a name and zero or more input parameters. The number and type of input parameters are all specific to a function.
     *
     * > **Examples:**
     * >
     * > 1. ```
     * >    STARTSWITH(main_text, search_text)
     * >
     * >    STARTSWITH("Jonh Adams", "Jon")
     * >
     * >    ```
     * > 2. ```
     * >    PRODUCT(number1, number2, ...)
     * >
     * >    PRODUCT(10, 23, 5, -75)
     * >
     * >    ```
     *
     * The first example above is the "STARTSWITH" function. This function checks whether a string starts with the characters of a search string, returning true or false as appropriate. It accepts two text parameters, _main text_ and _search text_. The second example is the "PRODUCT" function. This function multiplies all the numbers given as arguments and returns the resulting number.  There is no fixed number of input parameter for this function. At a minimum it takes two parameters and maximum it can have 100.
     *
     * ### Data query expressions
     *
     * Altogic does not use a separate data query syntax \(e.g., SQL\) for selecting/filtering data from the database. **You use the same expression syntax described above and functions to query your data.**
     *
     * Assuming you have an imaginary product model with quantity \(integer\), weight \(decimal\), volume \(decimal\) and type \(text\) information. Below are some data query examples that you can create to fetch/filter your products data.
     *
     * > **Examples:**
     * >
     * > 1. ```
     * >    quantity > 100 && quantity < 200 && type == "plastic"
     * >    ```
     * > 2. ```
     * >    (weight / volume > 2 && type == 'metal') || (weight / volume <= 2 && type == 'plastic')
     * >    ```
     *
     * The first data query above searches for products that are of type plastic and has a stock quantity between 100-200 items. The second data query search for products either metal and with a weight to volume ration greater than 2 or plastics with a weight to volume ration less than or equal to 2.
     * @param {string} expression The query expression string
     * @throws Throws an exception if `expression` is not specified
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    filter(expression) {
        (0, helpers_1.checkRequired)("expression", expression);
        __classPrivateFieldGet(this, _QueryBuilder_action, "f").expression = expression;
        return this;
    }
    /**
     * Look up (left outer join) the specified field ({@link SimpleLookup}) of the model or perform specified lookup query ({@link ComplexLookup}) when getting data form the database
     *
     * If multiple lookup method calls are chained then each call is concatenated to a list, so that you can perform multiple lookups.
     * @param {SimpleLookup | ComplexLookup} lookup The lookup to make (left outer join) while getting the object from the database
     * @throws Throws an exception if `lookup` is not specified
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    lookup(lookup) {
        (0, helpers_1.objectRequired)("lookup", lookup);
        if (__classPrivateFieldGet(this, _QueryBuilder_action, "f").lookups)
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").lookups.push(lookup);
        else
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").lookups = [lookup];
        return this;
    }
    /**
     * Paginates to the specified page number. In combination with {@link limit}, primarily used to paginate through your data.
     *
     * If multiple page method calls are chained then the last one overwrites the previous page values.
     * @param {number} pageNumber An integer that specifies the page number
     * @throws Throws an exception if `pageNumber` is not specified
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    page(pageNumber) {
        (0, helpers_1.integerRequired)("pageNumber", pageNumber);
        __classPrivateFieldGet(this, _QueryBuilder_action, "f").page = pageNumber;
        return this;
    }
    /**
     * Limits the max number of objects returned from the database, namely defines the page size for pagination. In combination with {@link page}, primarily used to paginate through your data. Even if you do not specify a limit in your database queries, Altogic automatically limits the number of objects returned from the database by setting the default limits.
     *
     * If multiple limit method calls are chained then the last one overwrites the previous limit values.
     * @param {number} limitCount An integer that specifies the max number of objects to return
     * @throws Throws an exception if `limitCount` is not specified or `limitCount=0`
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    limit(limitCount) {
        (0, helpers_1.integerRequired)("limitCount", limitCount);
        if (limitCount === 0)
            throw new ClientError_1.ClientError("invalid_limit", `Limit value needs to be at least 1.`);
        __classPrivateFieldGet(this, _QueryBuilder_action, "f").limit = limitCount;
        return this;
    }
    /**
     * Sorts the returned objects by the value of the specified field and sort direction
     *
     * If multiple sort method calls are chained then each call is concatenated to a list, so that you can perform sorting by multiple fields.
     * @param {string} fieldName The name of the field that will be used in sorting the returned objects. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @param {'asc' | 'desc'} sortDirection Sort direction whether ascending or descending
     * @throws Throws an exception if `fieldName` is not specified or `sortDirection` (if specified) is not 'asc' or 'desc'
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    sort(fieldName, sortDirection) {
        (0, helpers_1.checkRequired)("sort fieldName", fieldName);
        if (sortDirection !== "asc" && sortDirection !== "desc")
            throw new ClientError_1.ClientError("invalid_sort_direction", `${sortDirection} is not a valid sort direction. Sort direction can be either 'asc' or 'desc'.`);
        if (__classPrivateFieldGet(this, _QueryBuilder_action, "f").sort)
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").sort.push({ field: fieldName, direction: sortDirection });
        else
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").sort = [{ field: fieldName, direction: sortDirection }];
        return this;
    }
    /**
     * Applies a field mask to the result and returns all the fields except the omitted ones.
     *
     * If multiple omit method calls are chained then each call is concatenated to a list.
     * @param {...string[]} fields The name of the fields that will be omitted in retrieved objects. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @throws Throws an exception if no omitted fields is specified
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    omit(...fields) {
        (0, helpers_1.arrayRequired)("omit fields", fields);
        if (__classPrivateFieldGet(this, _QueryBuilder_action, "f").omit)
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").omit.push(...fields);
        else
            __classPrivateFieldGet(this, _QueryBuilder_action, "f").omit = [...fields];
        return this;
    }
    /**
     * Groups the objects of the model by the specified expression or by the specified fields. This method is chained with the {@link compute} method to calculated group statistics of your models.
     *
     * If multiple group method calls are chained then the last one overwrites the previous group values.
     * @param {[string]} fields Either a single expression string or an array of field names that will be used for grouping. In case of field names list, the field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @throws Throws an exception if `expression` or `fields` is not specified correctly
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    group(fieldsOrExpression) {
        (0, helpers_1.checkRequired)("group fields or expression", fieldsOrExpression);
        if (typeof fieldsOrExpression !== "string" &&
            !Array.isArray(fieldsOrExpression))
            throw new ClientError_1.ClientError("invalid_group_definition", `The group method accepts either a grouping expression string or a string array of field names/paths.`);
        __classPrivateFieldGet(this, _QueryBuilder_action, "f").group = fieldsOrExpression;
        return this;
    }
    /**
     * Creates top level model object(s) in the database. This method ignores all query modifiers except {@link omit}. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with create? |
     * | :--- | :--- |
     * | filter |  |
     * | group |  |
     * | limit |  |
     * | lookup |  |
     * | omit | &#10004; |
     * | page |  |
     * | sort |  |
     *
     * > If a list of objects is provided as input and if any one of the objects in this list fails during creation, none of the objects will be created in the database, i.e., database transaction will be rolled back
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {object| object[]} values An object or a list of objects that contains the fields and their values to create in the database
     * @throws Throws an exception if `values` is not specified
     * @returns Returns the newly create object or list of objects in the database.
     */
    create(values) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.objectRequired)("create values", values);
            return yield this.fetcher.post(`/_api/rest/v1/db/create`, {
                values,
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Sets the sub-object field value of the parent object identified by parentId. This method ignores all query modifiers except {@link omit}. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with set? |
     * | :--- | :--- |
     * | filter |  |
     * | group |  |
     * | limit |  |
     * | lookup |  |
     * | omit | &#10004; |
     * | page |  |
     * | sort |  |
     *
     * As an example, assuming you have a `users` top-level model where you define your app users and in this model you have an *object* field called `profile`, which is a sub-model, that you store details about your users. When creating users, you most probably will not be collecting profile information but at a later stage you might collect this information and would like to set the value of the profile. You can use this **set** method to set the profile field of a users object identified by the parentId.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {object} values An object that contains the fields and their values of a sub-model object to set in the database
     * @param {string} parentId The id of the parent object
     * @param {boolean} returnTop Flag to specify whether to return the newly set child object or the updated top-level object
     * @throws Throws an exception if `values` or `parentId` is not specified
     * @returns Returns the newly create object in the database. If `returnTop` is set to true, it returns the updated top-level object instead of the set sub-model object.
     */
    set(values, parentId, returnTop = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.objectRequired)("set values", values);
            (0, helpers_1.checkRequired)("set parentId", parentId);
            return yield this.fetcher.post(`/_api/rest/v1/db/set`, {
                values,
                parentId,
                returnTop,
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Appends object(s) to a child-list of the parent object identified by parentId. This method ignores all query modifiers except {@link omit}. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with append? |
     * | :--- | :--- |
     * | filter |  |
     * | group |  |
     * | limit |  |
     * | lookup |  |
     * | omit | &#10004; |
     * | page |  |
     * | sort |  |
     *
     * As an example, assuming you have a `users` top-level model where you define your app users and in this model you have an **object-list** field called `addresses`, which is a sub-model list, that you store addresses of your users. When creating users, you most probably will not be collecting address information but at a later stage you might collect this information and would like to add these addresses to your users' addresses list. You can use this **append** method to add child object(s) to a user identified by the parentId.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {object| object[]} values An object or list of objects that contains the fields and their values to append to an object-list
     * @param {string} parentId The id of the parent object
     * @param {boolean} returnTop Flag to specify whether to return the newly appended child object(s) or the updated top-level object
     * @throws Throws an exception if `values` or `parentId` is not specified
     * @returns Returns the newly create object(s) in the database. If `returnTop` is set to true, it returns the updated top-level object instead of the appended sub-model object(s).
     */
    append(values, parentId, returnTop = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.objectRequired)("append values", values);
            (0, helpers_1.checkRequired)("append parentId", parentId);
            return yield this.fetcher.post(`/_api/rest/v1/db/append`, {
                values,
                parentId,
                returnTop,
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Runs the query defined by the query modifiers and returns matching objects array. This method accepts all the query modifiers except {@link group}. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with get? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |  &#10004; |
     * | lookup | &#10004; |
     * | omit |  &#10004; |
     * | page |  &#10004; |
     * | sort |  &#10004; |
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {boolean} returnCountInfo Flag to specify whether to return the count and pagination information such as total number of objects matched, page number and page size
     * @returns Returns the array of objects matching the query. If `returnCountInfo=true`, returns an object which includes count information and list of matched objects.
     */
    get(returnCountInfo = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/get-list`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                returnCountInfo,
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Runs the specified computation(s) on the model objects and returns the computation results. This method is typically chained with {@link group} and {@link filter} methods. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with compute? |
     * | :--- | :--- |
     * | filter | &#10004; |
     * | group | &#10004; |
     * | limit |  |
     * | lookup |  |
     * | omit |  |
     * | page |  |
     * | sort |  |
     *
     * For example, you might have an orders model where you keep track of your sales of particular products. Using this method you can calculate the total order revenues, average order size, total number of orders and revenues on a weekly or monthly basis etc. The {@link group} method helps you to group your orders. If you would like to group your orders by the week or the month of the year, you can specify a grouping expression which calculates the week or the month of your order creation date. You can also specify the name of the field in the {@link group} method, such as the productId, which will group your orders by product.
     *
     * The computations parameter defines the calculations that you will be running on the filtered and/or grouped objects. You can either specify a single computation or an array of computations. Altogic will perform the specified calculations for each group and return their results. You can specify multiple calculations at the same time, such as, you can calculate the total number of orders, total sales amount, and average order size on a weekly basis, etc.
     *
     * > If you do not specify any {@link group} or {@link filter} methods in your query builder chain, it performs the computations on all objects of the model, namely groups all objects stored in the database into a single group and runs the calculations on this group.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {computations} values An object or list of objects that contains the fields and their values to append to an object-list
     * @throws Throws an exception if `computations` is not specified
     * @returns Returns the computation results
     */
    compute(computations) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("computations", computations, false);
            return yield this.fetcher.post(`/_api/rest/v1/db/compute`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                computations: Array.isArray(computations) ? computations : [computations],
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Runs the query defined by the query modifiers and returns the matching single object. If there are more than one object mathing the query, it returns the first one. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with getSingle? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |   |
     * | lookup | &#10004; |
     * | omit |  &#10004; |
     * | page |   |
     * | sort |   |
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @returns Returns the object matching the query.
     */
    getSingle() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetcher.post(`/_api/rest/v1/db/get-single`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Retrieves the specified number of objects from the database randomly. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with getRandom? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |   |
     * | lookup | &#10004; |
     * | omit |  &#10004; |
     * | page |   |
     * | sort |   |
     *
     * If {@link filter} modifier is used with this method, Altogic first narrows down the set of objects that can be selected using the filter query and among these filtered objects performs random selection.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {number} count An integer that specifies the number of items to randomly select
     * @throws Throws an exception if `count` is not specified
     * @returns Returns the array of objects selected randomly.
     */
    getRandom(count) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.integerRequired)("count", count);
            return yield this.fetcher.post(`/_api/rest/v1/db/get-random`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                count,
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Updates the objects matching the query using the input values. This method directly sets the field values of the objects in the database with the values provided in the input. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with update? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |   |
     * | lookup | &#10004; |
     * | omit |  |
     * | page |   |
     * | sort |   |
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {object} values An object that contains the fields and their values to update in the database
     * @throws Throws an exception if `values` is not specified
     * @returns Returns information about the update operation
     */
    update(values) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.objectRequired)("update values", values);
            if (!__classPrivateFieldGet(this, _QueryBuilder_action, "f").expression)
                throw new ClientError_1.ClientError("missing_filter_query", `The update method requires a filter query to select the objects to update in the database.`);
            return yield this.fetcher.post(`/_api/rest/v1/db/update`, {
                values,
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Updates the objects matching the query using the input {@link FieldUpdate} instruction(s). See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with updateFields? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |   |
     * | lookup | &#10004; |
     * | omit |  |
     * | page |   |
     * | sort |   |
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {FieldUpdate| [FieldUpdate]} fieldUpdates Field update instruction(s)
     * @throws Throws an exception if `fieldUpdates` is not specified
     * @returns Returns information about the update operation
     */
    updateFields(fieldUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.objectRequired)("fieldUpdates", fieldUpdates);
            let updates = null;
            if (Array.isArray(fieldUpdates))
                updates = fieldUpdates;
            else
                updates = [fieldUpdates];
            if (!__classPrivateFieldGet(this, _QueryBuilder_action, "f").expression)
                throw new ClientError_1.ClientError("missing_filter_query", `The updateFields method requires a filter query to select the objects to update in the database.`);
            return yield this.fetcher.post(`/_api/rest/v1/db/update-fields`, {
                updates,
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Deletes the objects matching the query. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with delete? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit |   |
     * | lookup | &#10004; |
     * | omit |  |
     * | page |   |
     * | sort |   |
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @throws Throws an exception if no `filter` method is called in the query builder chain
     * @returns Returns information about the delete operation
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _QueryBuilder_action, "f").expression)
                throw new ClientError_1.ClientError("missing_filter_query", `The delete method requires a filter query to select the objects to delete in the database.`);
            return yield this.fetcher.post(`/_api/rest/v1/db/delete`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
    /**
     * Retrieves a list of objects from the database running the text search. It performs a logical `OR` search of the terms unless specified as a phrase between double-quotes. If filter is specified it applies the filter query to further narrow down the results. The retrieved objects are sorted automatically in terms of the scores of the text search results. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with getRandom? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit | &#10004; |
     * | lookup | &#10004; |
     * | omit |  &#10004; |
     * | page |  &#10004; |
     * | sort |   |
     *
     * > *There should be at least one `text` or `rich-text` field marked as **searchable** in model definition to use this method.*
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} text The search string
     * @param {boolean} returnCountInfo Flag to specify whether to return the count and pagination information such as total number of objects matched, page number and page size
     * @throws Throws an exception if input search `text` is not specified
     * @returns Returns the array of objects matching the text search string and filter query (if specified). If `returnCountInfo=true`, returns an object which includes count information and list of matched objects.
     */
    searchText(text, returnCountInfo = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("text", text);
            return yield this.fetcher.post(`/_api/rest/v1/db/search-text`, {
                query: __classPrivateFieldGet(this, _QueryBuilder_action, "f"),
                returnCountInfo,
                text,
                model: __classPrivateFieldGet(this, _QueryBuilder_modelName, "f"),
            });
        });
    }
}
exports.QueryBuilder = QueryBuilder;
_QueryBuilder_modelName = new WeakMap(), _QueryBuilder_action = new WeakMap();
//# sourceMappingURL=QueryBuilder.js.map