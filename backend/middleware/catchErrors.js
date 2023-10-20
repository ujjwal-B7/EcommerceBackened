module.exports = (func) => async (req, res, next) => {
  try {
    await Promise.resolve(func(req, res, next));
  } catch (error) {
    next(error);
  }
};
