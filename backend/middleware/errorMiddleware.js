const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  console.error("Error occurred:", err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.message && err.message.includes("CastError")) {
    err = new ErrorHandler(`Resource not found : ${err.path}`, 404);
  }

  // mongoose duplicate key error
  if (err.message && err.message.includes("duplicate key error")) {
    // extracts the duplicate key field from the error message using a regular expression
    const duplicateKeyField = err.message.match(/index: ([^_]+)_/)[1];
    const message = `Duplicate ${duplicateKeyField}: Email is already registered.`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid.`;
    err = new ErrorHandler(message, 400);
  }

  //  jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired.`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
