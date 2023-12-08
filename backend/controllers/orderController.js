const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const catchErrors = require("../middleware/catchErrors");
const ErrorHandler = require("../utils/errorHandler");

// creating a new product order
exports.createOrder = catchErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  //   demo data
  //  {
  //   "itemsPrice":200,
  //   "shippingPrice":100,
  //   "totalPrice":300,
  //   "orderItems":[{
  //     "product":"6568ce932eeab2c88f80477d",
  //     "name":"guitar",
  //     "price":"1500",
  //     "image":"sample image",
  //     "quantity":1
  //   }
  // ],
  // "shippingInfo":{
  //   "address":"ktm",
  //   "city":"ktm",
  //   "Province":"Bagmati",
  //   "phoneNumber":9814313435
  // },
  // "paymentInfo":{
  //   "id":"sample paymentInfo",
  //   "status":"succceded"
  // }
  // }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    order,
  });
});

// get single order by admin
exports.getSingleOrder = catchErrors(async (req, res, next) => {
  const singleOrder = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!singleOrder) {
    return next(new ErrorHandler("No order found.", 404));
  }
  res.status(200).json({
    success: true,
    singleOrder,
  });
});

// get my orders
exports.getTotalOrdersByUser = catchErrors(async (req, res, next) => {
  const myOrders = await Order.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    myOrders,
  });
});
