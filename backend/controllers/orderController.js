const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const catchErrors = require("../middleware/catchErrors");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
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
  console.log("reached", orderItems);
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
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  await order.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    order,
  });
});

// get single order
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

// get my orders by the user to see their order history
exports.getTotalOrdersByUser = catchErrors(async (req, res, next) => {
  const myOrders = await Order.find({ user: req.user.id });

  console.log("orders", myOrders);

  res.status(200).json({
    success: true,
    myOrders,
  });
});

// get all orders by Admin
exports.getTotalOrdersByAdmin = catchErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  for (const item of orders) {
    totalAmount += item.totalPrice;
  }
  console.log(totalAmount);
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update order status by admin
exports.updateOrderStatus = catchErrors(async (req, res, next) => {
  const { _id, orderStatus } = req.body;
  console.log("**************", _id);
  console.log(orderStatus);
  const order = await Order.findById(_id);
  console.log("order", order);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("Your product has already been delivered", 404)
    );
  }

  // order.orderItems.forEach(async (order) => {
  //   await updateStock(order.product, order.quantity);
  // });
  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

// update stock func
const updateStock = async (productId, qty) => {
  const product = await Product.findById(productId);
  product.Stock = product.Stock - qty;
  await product.save({
    validateBeforeSave: false,
  });
};

// delete order
exports.deleteOrder = catchErrors(async (req, res, next) => {
  const deletedOrder = await Order.findById(req.params.id);
  const result = await deletedOrder.deleteOne();
  res.status(201).json({
    success: true,
    result,
    message: "Order deleted succesfully.",
  });
});
