const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/order/new", authenticatedUser, orderController.createOrder);
router.get(
  "/order/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  orderController.getSingleOrder
);
router.get(
  "/orders/myOrders",
  authenticatedUser,
  orderController.getTotalOrdersByUser
);

module.exports = router;
