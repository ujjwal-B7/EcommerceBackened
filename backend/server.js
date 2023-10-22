const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught error");
  process.exit(1);
});

// unhandledRejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// config
dotenv.config({ path: "backend/config/config.env" });

// connecting database
connectDatabase();

mongoose.connection.once("open", () => {
  console.log("Mongodb connected succesfully");
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
