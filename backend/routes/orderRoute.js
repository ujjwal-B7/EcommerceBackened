const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/order/new", authenticatedUser, orderController.createOrder);

module.exports = router;
