const catchErrors = require("../middleware/catchErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// payment
exports.processPayment = catchErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

// sending api key to the frontend
exports.sendStripeApiKey = catchErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
