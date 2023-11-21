const nodeMailer = require("nodemailer");
exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    // host: process.env.HOST,
    // port: process.env.SMTP_PORT,
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
  await transporter.sendMail(mailOptions);
};
