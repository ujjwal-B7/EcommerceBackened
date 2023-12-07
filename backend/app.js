const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
// built in middleware that parses the incoming json data and makes it available as req.body
app.use(express.json());
app.use(cookieParser());

// Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

// middleware for errors
app.use(errorMiddleware);
module.exports = app;
