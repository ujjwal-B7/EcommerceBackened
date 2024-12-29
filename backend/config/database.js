const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: "Ecommerce",
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDatabase;
