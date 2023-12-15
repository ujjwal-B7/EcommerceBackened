const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/order/new", authenticatedUser, orderController.createOrder);
router
  .route("/admin/order/:id")
  .get(
    // "/order/:id",
    authenticatedUser,
    authorizedRoles("admin"),
    orderController.getSingleOrder
  )
  .put(
    authenticatedUser,
    authorizedRoles("admin"),
    orderController.updateOrderStatus
  )
  .delete(
    authenticatedUser,
    authorizedRoles("admin"),
    orderController.deleteOrder
  );
router.get(
  "/admin/order/total",
  authenticatedUser,
  authorizedRoles("admin"),
  orderController.getTotalOrdersByAdmin
);
router.get(
  "/orders/myOrders",
  authenticatedUser,
  orderController.getTotalOrdersByUser
);

module.exports = router;
