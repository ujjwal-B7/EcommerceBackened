const ErrorHandler = require("../utils/errorHandler");
const catchErrors = require("../middleware/catchErrors");
const User = require("../model/userModel");

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
  const token = user.getJwtToken();
  res.status(201).json({ success: true, token });
});
