const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // console.error("Error occurred:", err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CASTERROR") {
    err = new ErrorHandler(`${err.message}`, 400);
  }

  // mongoose duplicate key error
  if (err.message && err.message.includes("duplicate key error")) {
    const duplicateKeyField = err.message.match(/index: ([^_]+)_/)[1];
    const message = `Duplicate ${duplicateKeyField} Email is already registered.`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
