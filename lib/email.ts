const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error: any, success: any) => {
  if (error) {
    console.error("Error verifying transport:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
