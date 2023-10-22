const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // console.error("Error occurred:", err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if ((err.name = "CASTERROR")) {
    const message = `Resource not found.Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
