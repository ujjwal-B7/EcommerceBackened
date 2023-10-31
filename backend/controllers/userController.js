const ErrorHandler = require("../utils/errorHandler");
const catchErrors = require("../middleware/catchErrors");
const User = require("../model/userModel");
const { token } = require("../utils/jwtToken");

// user register
exports.registerUser = catchErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    profile: {
      public_id: "sample id",
      url: "profileUrl",
    },
  });
  token(user, 201,res);
  // const token = user.getJwtToken();
  // res.status(201).json({ success: true, token });
});

// user login
exports.loginUser = catchErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter both email and password", 400));
  }
  const user = await User.findOne({
    email: email,
  }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const matchPassword = await user.comparePassword(password);
  if (!matchPassword) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  token(user, 200,res);
  // const token = user.getJwtToken();
  // res.status(200).json({ success: true, user, token });
});
