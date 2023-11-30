const catchErrors = require("../middleware/catchErrors");
const Product = require("../model/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Admin Route..create product
exports.createProduct = catchErrors(async (req, res, next) => {
  // try {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
  // } catch (error) {
  //   next(new ErrorHandler(error));
  // }
});

// getting all the products
exports.getAllProducts = catchErrors(async (req, res) => {
  const productPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage);
  const products = await apiFeature.query;
  // const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// getting single product
exports.getSingleProduct = catchErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log("Product found.");
  res.status(200).json({
    success: true,
    product,
    productCount,
  });
});

// Admin route...updating the existing products
exports.updateProduct = catchErrors(async (req, res, next) => {
  let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
});

// Admin route..deleting the existing product
exports.deleteProduct = catchErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// create a product review or update the review
exports.createProductReview = catchErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
  });
});
