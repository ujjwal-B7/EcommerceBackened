const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Mongodb connected succesfully");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDatabase;
