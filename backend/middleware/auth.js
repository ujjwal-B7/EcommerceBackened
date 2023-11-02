const ErrorHandler = require("../utils/errorHandler");
const catchErrors = require("./catchErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// user authentication
exports.authenticatedUser = catchErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("Please login in to access the resource", 401)
    );
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

// roles authorization
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access the resource`,
          403
        )
      );
    }
    next();
  };
};
