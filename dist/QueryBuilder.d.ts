import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import { DBObject } from "./DBObject";
import { APIError, SimpleLookup, ComplexLookup, UpdateInfo, DeleteInfo, FieldUpdate, GroupComputation } from "./types";
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
export declare class QueryBuilder extends APIBase {
    #private;
    /**
     * Creates an instance of QueryBuilder to run queries and CRUD operations on your app's database.
     * @param {string} name The name of the model that this query builder will be operating on
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(name: string, fetcher: Fetcher);
    /**
     * Gets a {@link DBObject} instance that refers to the object with the specified id.
     *
     * {@link DBObject} provides convenience methods to perform create, update, delete, get and upsert operations.
     *
     * @param {string} [id] The unique identifier of the object that is stored in the database
     * @returns A DBObject instance
     */
    object(id?: string): DBObject;
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
     * For detailed information on functions supported in filter queries, please have a look to the [Functions Reference](https://www.altogic.com/docs/category/functions).
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
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    filter(expression: string): QueryBuilder;
    /**
     * Look up (left outer join) the specified field ({@link SimpleLookup}) of the model or perform specified lookup query ({@link ComplexLookup}) when getting data form the database
     *
     * If multiple lookup method calls are chained then each call is concatenated to a list, so that you can perform multiple lookups.
     * @param {SimpleLookup | ComplexLookup} lookup The lookup to make (left outer join) while getting the object from the database
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    lookup(lookup: SimpleLookup | ComplexLookup): QueryBuilder;
    /**
     * Paginates to the specified page number. In combination with {@link limit}, primarily used to paginate through your data.
     *
     * If multiple page method calls are chained then the last one overwrites the previous page values.
     * @param {number} pageNumber An integer that specifies the page number
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    page(pageNumber: number): QueryBuilder;
    /**
     * Limits the max number of objects returned from the database, namely defines the page size for pagination. In combination with {@link page}, primarily used to paginate through your data. Even if you do not specify a limit in your database queries, Altogic automatically limits the number of objects returned from the database by setting the default limits.
     *
     * If multiple limit method calls are chained then the last one overwrites the previous limit values.
     * @param {number} limitCount An integer that specifies the max number of objects to return
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    limit(limitCount: number): QueryBuilder;
    /**
     * Sorts the returned objects by the value of the specified field and sort direction
     *
     * If multiple sort method calls are chained then each call is concatenated to a list, so that you can perform sorting by multiple fields.
     * @param {string} fieldName The name of the field that will be used in sorting the returned objects. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @param {'asc' | 'desc'} sortDirection Sort direction whether ascending or descending
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    sort(fieldName: string, sortDirection: "asc" | "desc"): QueryBuilder;
    /**
     * Applies a field mask to the result and returns all the fields except the omitted ones.
     *
     * If multiple omit method calls are chained then each call is concatenated to a list.
     * @param {...string[]} fields The name of the fields that will be omitted in retrieved objects. The field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    omit(...fields: string[]): QueryBuilder;
    /**
     * Groups the objects of the model by the specified expression or by the specified fields. This method is chained with the {@link compute} method to calculated group statistics of your models.
     *
     * If multiple group method calls are chained then the last one overwrites the previous group values.
     * @param {[string]} fieldsOrExpression Either a single expression string or an array of field names that will be used for grouping. In case of field names list, the field name can be in dot-notation to specify sub-object fields (e.g., field.subField)
     * @returns {QueryBuilder} Returns the query builder itself so that you can chain other methods
     */
    group(fieldsOrExpression: [string] | string): QueryBuilder;
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
     * @returns Returns the newly create object or list of objects in the database.
     */
    create(values: object | object[]): Promise<{
        data: object | object[] | null;
        errors: APIError | null;
    }>;
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
     * @returns Returns the newly create object in the database. If `returnTop` is set to true, it returns the updated top-level object instead of the set sub-model object.
     */
    set(values: object, parentId: string, returnTop?: boolean): Promise<{
        data: object | null;
        errors: APIError | null;
    }>;
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
     * @returns Returns the newly create object(s) in the database. If `returnTop` is set to true, it returns the updated top-level object instead of the appended sub-model object(s).
     */
    append(values: object | object[], parentId: string, returnTop?: boolean): Promise<{
        data: object | object[] | null;
        errors: APIError | null;
    }>;
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
    get(returnCountInfo?: boolean): Promise<{
        data: object | object[] | null;
        errors: APIError | null;
    }>;
    /**
     * Runs the specified computation(s) on the model objects and returns the computation results. This method is typically chained with {@link group} and {@link filter} methods. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with compute? |
     * | :--- | :--- |
     * | filter | &#10004; |
     * | group | &#10004; |
     * | limit | &#10004;  |
     * | lookup |  |
     * | omit |  |
     * | page | &#10004; |
     * | sort |  |
     *
     * For example, you might have an orders model where you keep track of your sales of particular products. Using this method you can calculate the total order revenues, average order size, total number of orders and revenues on a weekly or monthly basis etc. The {@link group} method helps you to group your orders. If you would like to group your orders by the week or the month of the year, you can specify a grouping expression which calculates the week or the month of your order creation date. You can also specify the name of the field in the {@link group} method, such as the productId, which will group your orders by product.
     *
     * The computations parameter defines the calculations that you will be running on the filtered and/or grouped objects. You can either specify a single computation or an array of computations. Altogic will perform the specified calculations for each group and return their results. You can specify multiple calculations at the same time, such as, you can calculate the total number of orders, total sales amount, and average order size on a weekly basis, etc. Additionally, you can also sort the computation results ascending or descenging.
     *
     * > If you do not specify any {@link group} or {@link filter} methods in your query builder chain, it performs the computations on all objects of the model, namely groups all objects stored in the database into a single group and runs the calculations on this group.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {GroupComputation | GroupComputation[]} computations An object or list of objects that contains the fields and their values to append to an object-list
     * @returns Returns the computation results
     */
    compute(computations: GroupComputation | GroupComputation[]): Promise<{
        data: object | object[] | null;
        errors: APIError | null;
    }>;
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
    getSingle(): Promise<{
        data: object | null;
        errors: APIError | null;
    }>;
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
     * @returns Returns the array of objects selected randomly.
     */
    getRandom(count: number): Promise<{
        data: object[] | null;
        errors: APIError | null;
    }>;
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
     * @returns Returns information about the update operation
     */
    update(values: object): Promise<{
        data: UpdateInfo;
        errors: APIError | null;
    }>;
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
     * @returns Returns information about the update operation
     */
    updateFields(fieldUpdates: FieldUpdate | [FieldUpdate]): Promise<{
        data: UpdateInfo;
        errors: APIError | null;
    }>;
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
     * @returns Returns information about the delete operation
     */
    delete(): Promise<{
        data: DeleteInfo;
        errors: APIError | null;
    }>;
    /**
     * Retrieves a list of objects from the database running the text search. It performs a logical `OR` search of the terms unless specified as a phrase between double-quotes. If filter is specified it applies the filter query to further narrow down the results. The retrieved objects are sorted automatically in terms of the scores of the text search results. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with searchText? |
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
     * @returns Returns the array of objects matching the text search string and filter query (if specified). If `returnCountInfo=true`, returns an object which includes count information and list of matched objects.
     */
    searchText(text: string, returnCountInfo?: boolean): Promise<{
        data: object[] | null;
        errors: APIError | null;
    }>;
    /**
     * Retrieves a list of objects from the database running the full-text (fuzzy) search on the specified field, which must be covered by a full-text search index. If filter is specified it applies the filter query to further narrow down the results. The retrieved objects are sorted automatically in terms of the scores of the full-text search results. See table below for applicable modifiers that can be used with this method.
     *
     * | Modifier | Chained with searchFuzzy? |
     * | :--- | :--- |
     * | filter |  &#10004; |
     * | group |  |
     * | limit | &#10004; |
     * | lookup | &#10004; |
     * | omit |  &#10004; |
     * | page |  &#10004; |
     * | sort |   |
     *
     * > *This method can run only on top-level objects with a full-text (fuzzy) searchable field. You cannot run fuzzy search on sub-model objects or sub-model object lists.*
     *
     * > *The searched field should be a `text` or `rich-text` field marked as **full-text (fuzzy) searchable** in model definition to use this method.*
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} fieldName The name of the field to run the full-text search.
     * @param {string} text The search string
     * @returns Returns the array of objects matching the full-text search and filter query (if specified).
     */
    searchFuzzy(fieldName: string, text: string): Promise<{
        data: object[] | null;
        errors: APIError | null;
    }>;
}
//# sourceMappingURL=QueryBuilder.d.ts.map