const nodeMailer = require("nodemailer");
exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // try {
  await transporter.sendMail(mailOptions);
  // } catch (error) {
  //   console.log(error.message);
  // }
};
