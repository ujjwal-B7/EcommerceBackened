const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/order/new", authenticatedUser, orderController.createOrder);
router.get("/order/:id", authenticatedUser, orderController.getSingleOrder);
router.get(
  "/orders/myOrders",
  authenticatedUser,
  orderController.getTotalOrdersByUser
);

// admin routes
router
  .route("/admin/order/:id")
  .delete(
    authenticatedUser,
    authorizedRoles("admin"),
    orderController.deleteOrder
  );
router.put(
  "/admin/order/update",
  authenticatedUser,
  authorizedRoles("admin"),
  orderController.updateOrderStatus
);
router.get(
  "/admin/order/total",
  authenticatedUser,
  authorizedRoles("admin"),
  orderController.getTotalOrdersByAdmin
);

module.exports = router;
