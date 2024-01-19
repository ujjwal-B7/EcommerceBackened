const express = require("express");
const router = express.Router();
const { authenticatedUser } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");
router.post("/payment", authenticatedUser, paymentController.processPayment);
router.get(
  "/stripeApiKey",
  authenticatedUser,
  paymentController.sendStripeApiKey
);
module.exports = router;
