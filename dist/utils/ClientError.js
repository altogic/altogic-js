"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = void 0;
/**
 * Class to create and throw instances of client errors during runtime.
 * @export
 * @class ClientError
 * @extends {Error}
 */
class ClientError extends Error {
    /**
     *Creates an instance of ClientError.
     * @param {string} code Specific short code of the error message
     * @param {string} message Short description of the error
     * @param {object} [details] Any additional details about the error
     */
    constructor(code, message, details) {
        super(message);
        this.origin = 'client_error';
        this.code = code;
        this.message = message;
        this.details = details;
    }
}
exports.ClientError = ClientError;
//# sourceMappingURL=ClientError.js.map