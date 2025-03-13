class APIError extends Error {
    /**
     * Creates a custom API error.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code (default: 500).
     * @param {Array|Object} details - Additional details about the error (default: null).
     */
    constructor(message, statusCode = 500, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.details = details; // Can include validation errors or any other relevant details
      Error.captureStackTrace(this, this.constructor);
    }
  
    /**
     * Formats the error for a JSON response.
     * @returns {Object} - A structured error object.
     */
    toJSON() {
      return {
        success: false,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.details && { details: this.details }),
      };
    }
  }
  
module.exports = APIError;
  