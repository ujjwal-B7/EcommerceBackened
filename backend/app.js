const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// built in middleware that parses the incoming json data and makes it available as req.body
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// config
dotenv.config({ path: "backend/config/config.env" });

// Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

// middleware for errors
app.use(errorMiddleware);
module.exports = app;
