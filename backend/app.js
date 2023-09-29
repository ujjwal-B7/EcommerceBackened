const express = require("express");
const app = express();

// built id middleware that parses the incoming json data and makes it available as req.body
app.use(express.json());
// Route imports
const product = require("./routes/productRoute");
app.use("/api/v1", product);

module.exports = app;
