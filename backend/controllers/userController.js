const ErrorHandler = require("../utils/errorHandler");
const catchErrors = require("../middleware/catchErrors");
const User = require("../model/userModel");
const { token } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// user register
exports.registerUser = catchErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // const image = await cloudinary.v2.uploader.upload(req.body.profile, {
  //   folder: "profiles",
  //   width: 150,
  //   crop: "scale",
  // });
  const user = await User.create({
    name,
    email,
    password,
    // profile: {
    //   // public_id: "public_id",
    //   // url: "image.secure_url",
    //   public_id: image.public_id,
    //   url: image.secure_url,
    // },
  });
  console.log(user);
  token(user, 201, res);
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
  console.log(user);
  token(user, 200, res);
  // const token = user.getJwtToken();
  // res.status(200).json({ success: true, user, token });
});

// user logout
exports.logoutUser = catchErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

// forgot password
exports.forgotPassword = catchErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/resetPassword/${resetToken}`;
  const message = `Your password reset link is:\n ${resetPasswordUrl} \n If you have not requested this link please ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery link",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Reset link sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return new ErrorHandler(error.message, 500);
  }
});

// reset password
exports.resetPassword = catchErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired!",
        404
      )
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password did not match", 400)
    );
  }
  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();
  token(user, 200, res);
});

// get user details
exports.getUserDetail = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.updatePassword = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const matchPassword = await user.comparePassword(req.body.oldPassword);
  if (!matchPassword) {
    return next(new ErrorHandler("Old password is invalid", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Both password should match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  token(user, 200, res);
  res.status(200).json({
    success: true,
  });
});

// update user profile
exports.updateProfile = catchErrors(async (req, res, next) => {
  const updatedUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.profile !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.profile.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const image = await cloudinary.v2.uploader.upload(req.body.profile, {
      folder: "profiles",
      width: 150,
      crop: "scale",
    });
    updatedUserData.profile = {
      public_id: image.public_id,
      url: image.secure_url,
    };
  }
  // image updating will be done later
  const user = await User.findByIdAndUpdate(req.user.id, updatedUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// update user role by admin
exports.updateUserRole = catchErrors(async (req, res, next) => {
  const updatedUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updatedUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// get all users by admin
exports.getAllUsers = catchErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// get single user by admin
exports.getSingleUserByAdmin = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//  delete user by admin
exports.deleteUser = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const result = await user.deleteOne();
  res.status(201).json({
    success: true,
    message: "User successfully deleted.",
  });
});
