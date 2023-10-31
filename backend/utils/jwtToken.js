// creating token and saving in cookie
exports.token = (user, status, res) => {
  const token = user.getJwtToken();
  const options = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(status)
    .cookie("token", token, options)
    .json({ success: true, user, token });
};
