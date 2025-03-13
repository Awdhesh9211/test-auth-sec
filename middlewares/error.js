const APIError = require('../utils/APIError');

const errorMiddleware = (err, req, res, next) => {
  // Check if the error is an instance of APIError
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }), // Include additional details if present
    });
  }

  // Handle other unhandled errors
  console.error('Unhandled Error:', err); // Log the full error for debugging in development

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  });
};

module.exports = errorMiddleware;

