import { ClientError } from './ClientError';

/**
 * Removes trailing slash character from input url string.
 * @export
 * @param {string} url  The url string to revove trailing slach
 * @returns Trailed url string
 */
export function removeTrailingSlash(url: string) {
   return url.replace(/\/$/, '');
}

/**
 * Normalizes the input url string by trimming spaces and removing any trailing slash character.
 * @export
 * @param {string} url The url string to normalize
 * @returns Normalized url string
 */
export function normalizeUrl(url: string) {
   return removeTrailingSlash(url.trim());
}

/**
 * Retrieves the query string parameter value from the browser url.
 * @export
 * @param {string} paramName The name of the query string parameter
 * @returns {string | null} The value of the parameter if found in query string part of the url or null otherwise
 */
export function getParamValue(paramName: string): string | null {
   if (globalThis.window && paramName) {
      let url = globalThis.window.location.href;

      paramName = paramName.replace(/[\[\]]/g, '\\$&');
      const regex = new RegExp('[?&#]' + paramName + '(=([^&#]*)|&|#|$)');
      let results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return null;
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
   }

   return null;
}

/**
 * Checks whether the input field value is null or undefiend. If it is null or undefined throws an exception.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 */
export function checkRequired(
   fieldName: string,
   fieldValue: any,
   checkEmptyString: boolean = true
) {
   if (fieldValue === null || fieldValue === undefined)
      throw new ClientError(
         'missing_required_value',
         `${fieldName} is a required parameter, cannot be left empty`
      );

   if (
      checkEmptyString &&
      (fieldValue === '' || (typeof fieldValue === 'string' && fieldValue.trim() === ''))
   )
      throw new ClientError(
         'missing_required_value',
         `${fieldName} is a required parameter, cannot be left empty`
      );
}

/**
 * Checks whether the input field value is an array or not.
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkEmptyString Flag to check empty arrays or not
 */
export function arrayRequired(
   fieldName: string,
   fieldValue: any,
   checkEmptyArray: boolean = false
) {
   checkRequired(fieldName, fieldValue, false);

   if (!Array.isArray(fieldValue))
      throw new ClientError('invalid_value', `${fieldName} needs to be an array`);

   if (checkEmptyArray && fieldValue.length === 0)
      throw new ClientError(
         'emtpy_array',
         `${fieldName} needs to be an array with at least one entry`
      );
}

/**
 * Checks whether the input field value is an integer or not
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkPositiveOrZero Flag to check whether the number is positive or not
 */
export function integerRequired(
   fieldName: string,
   fieldValue: any,
   checkPositiveOrZero: boolean = true
) {
   checkRequired(fieldName, fieldValue, false);

   if (!Number.isInteger(fieldValue))
      throw new ClientError('invalid_value', `${fieldName} needs to be an integer`);

   if (checkPositiveOrZero && fieldValue < 0)
      throw new ClientError('invalid_value', `${fieldName} needs to be a positive integer or zero`);
}

/**
 * Checks whether the input field value is an object or not
 * @export
 * @param {string} fieldName Field name to check for a value
 * @param {any} fieldValue Field value
 * @param {any} checkArray Flag to check whether the object is an array or not
 */
export function objectRequired(fieldName: string, fieldValue: any, checkArray: boolean = false) {
   checkRequired(fieldName, fieldValue, false);

   if (typeof fieldValue !== 'object')
      throw new ClientError('invalid_value', `${fieldName} needs to be an object`);

   if (Array.isArray(fieldValue) && checkArray)
      throw new ClientError('invalid_value', `${fieldName} needs to be an array`);
}
