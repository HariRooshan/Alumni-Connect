const nodemailer = require("nodemailer");
require("dotenv").config();

// JWT Secret


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.BALAMURUGAN_EMAIL, // Your email from .env
    pass: process.env.BALAMURUGAN_PASSWORD, // App password
  },
  tls:{
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take messages.");
  }
});
module.exports = transporter;
