const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");
router.route("/payment", isAuthenticated, paymentController.processPayment);
router.route(
  "/stripeApiKey",
  isAuthenticated,
  paymentController.sendStripeApiKey
);
module.exports = router;
