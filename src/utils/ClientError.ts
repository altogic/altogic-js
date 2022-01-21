/**
 * Class to create and throw instances of client errors during runtime.
 * @export
 * @class ClientError
 * @extends {Error}
 */
export class ClientError extends Error {
   /**
    * Originator of the error either a client error or an internal server error
    * @type {string}
    */
   origin: string;

   /**
    * Specific short code of the error message (e.g., validation_error, content_type_error)
    * @type {string}
    */
   code: string;

   /**
    * Short description of the error
    * @type {string}
    */
   message: string;

   /**
    * Any additional details about the error. Details is a JSON object and can have a different structure for different error types.
    * @type {object}
    */
   details?: object;

   /**
    *Creates an instance of ClientError.
    * @param {string} code Specific short code of the error message
    * @param {string} message Short description of the error
    * @param {object} [details] Any additional details about the error
    */
   constructor(code: string, message: string, details?: object) {
      super(message);
      this.origin = 'client_error';
      this.code = code;
      this.message = message;
      this.details = details;
   }
}
