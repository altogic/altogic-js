/**
 * Removes trailing slash character from input url string.
 * @export
 * @param {string} url  The url string to revove trailing slach
 * @returns Trailed url string
 */
export declare function removeTrailingSlash(url: string): string;
/**
 * Normalizes the input url string by trimming spaces and removing any trailing slash character.
 * @export
 * @param {string} url The url string to normalize
 * @returns Normalized url string
 */
export declare function normalizeUrl(url: string): string;
/**
 * Retrieves the query string parameter value from the browser url.
 * @export
 * @param {string} paramName The name of the query string parameter
 * @returns {string | null} The value of the parameter if found in query string part of the url or null otherwise
 */
export declare function getParamValue(paramName: string): string | null;
/**
 * Checks whether the input field value is specified or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 * @throws Throws an exception if `fieldValue` is `null` or `undefined`. If `checkEmptyString=true`, throws an exception if string is empty.
 */
export declare function checkRequired(fieldName: string, fieldValue: any, checkEmptyString?: boolean): void;
/**
 * Checks whether the input field value is an array or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyArray Flag to check empty arrays or not
 * @throws Throws an exception if `fieldValue` is not an array. If `checkEmptyArray=true`, throws an exception if array is empty.
 */
export declare function arrayRequired(fieldName: string, fieldValue: any, checkEmptyArray?: boolean): void;
/**
 * Checks whether the input field value is an integer or not
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkPositive Flag to check whether the number is positive or not
 * @throws Throws an exception if `fieldValue` is not an integer. If `checkPositive=true`, throws an exception if `fieldValue<=0`.
 */
export declare function integerRequired(fieldName: string, fieldValue: any, checkPositive?: boolean): void;
/**
 * Checks whether the input field value is an object or not
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkArray Flag to check whether the object is an array or not
 * @throws Throws an exception if `fieldValue` is not an object. If `checkArray=true`, throws an exception if `fieldValue` is also not an Array.
 */
export declare function objectRequired(fieldName: string, fieldValue: any, checkArray?: boolean): void;
//# sourceMappingURL=helpers.d.ts.map