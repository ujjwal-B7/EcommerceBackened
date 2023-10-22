const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    // console.log("Mongodb connected succesfully");
  } 
  catch (err) {
    console.error(err);
  }
};
// const connectDatabase = () => {
//   mongoose
//     .connect(process.env.DB_URI, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//     })
//     .then((data) => {
//       console.log("Mongodb connected successfully.");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
module.exports = connectDatabase;
