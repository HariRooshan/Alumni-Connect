const User = require("../models/User");
const Connection = require("../models/Connection");
const transporter = require("../config/transporter"); // Import transporter
require("dotenv").config();

// Email sending function
const sendEmail = async (req, res) => {
  try {
    console.log("inside send mail function");
    const { senderMail, receiverId , msg} = req.body;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("Sender mail : ", senderMail);

    const sender = await User.findOne({ email : senderMail });
    const toEmail = receiver.email;
    // console.log("User email:", toEmail);

    // console.log("sender object : ", sender);

    let emailBody = `Dear User,\n\nYou have a new Connection request from ${sender.firstName} ${sender.lastName}.\n\n`;
    emailBody += `Message : ${msg} \n\nPlease check your profile for more details.\n\nBest Regards,\nYour Alumni Portal Team`;

    const mailOptions = {
      from: process.env.BALAMURUGAN_EMAIL,
      to: toEmail,
      subject: "New Connection Request",
      text: emailBody,
    };

    console.log("📨 Sending email to:", toEmail);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    // console.log("Mail body : ",emailBody);

    res.json({ message: "✅ Request Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send request email", error: error.message });
  }
};

const responseEmail = async (req, res) => {
  try {
    console.log("inside response mail function");
    const { connectionId , msg} = req.body;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const sender = await User.findById(connection.senderId);
    const receiver = await User.findById(connection.receiverId);

    const toEmail = sender.email;
    // console.log("User email:", toEmail);

    let emailBody = `Dear ${sender.firstName},\n\nYour connection request has been ${msg}ed by ${receiver.firstName} ${receiver.lastName}.\n\n`;
    emailBody += `Please check your profile for more details.\n\nBest Regards,\nYour Alumni Portal Team`;

    const mailOptions = {
      from: process.env.BALAMURUGAN_EMAIL,
      to: toEmail,
      subject: "Connection Request Response",
      text: emailBody,
    };

    console.log("📨 Sending email to:", toEmail);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    // console.log("Mail body : ",emailBody);

    res.json({ message: "✅ Reply Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send reply email", error: error.message });
  }
}

// Export the function correctly
module.exports = { sendEmail , responseEmail};