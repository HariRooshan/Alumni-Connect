const User2 = require("../models/User_main");
const Alumni = require("../models/Alumni");
const transporter = require("../config/transporter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // Your MongoDB User model
require("dotenv").config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const JWT_SECRET = process.env.JWT_SECRET;
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
    if (!email || !password || !name || !role) {
      return res.status(400).send("All fields are required.");
    }
  
    // Ensure role is only one of the allowed values
    const allowedRoles = ["student", "staff", "alumni"];
    if (!allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).send("Invalid role.");
    }
  
    // Enforce domain restriction for students and staff
    if (role === "student" && !email.endsWith("@psgtech.ac.in")) {
      return res.status(400).send("Students must use a @psgtech.ac.in email.");
    }
  
    if (role === "staff" && !email.endsWith("@psgstaff.ac.in")) {
      return res.status(400).send("Staff must use a @psgstaff.ac.in email.");
    }
  
    try {
      let user = await User2.findOne({ email });
  
      if (user) {
        if (!user.isVerified) {
          await User2.deleteOne({ email }); // Remove unverified user for a fresh signup
        } else {
          return res.status(400).send("User already registered.");
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  
      user = new User2({ name, email, password, otp, otpExpiry, role });
      await user.save();
  
      transporter.sendMail({
        from: process.env.BALAMURUGAN_EMAIL,
        to: email,
        subject: "PSG Tech Alumni Association - Email Verification OTP",
        text: `Dear ${name},\n\nWelcome to the PSG Tech Alumni Association! 🎉\n\nTo complete your signup, please verify your email using the OTP below:\n\n🔢 Your OTP: ${otp}\n\nThis OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\nLooking forward to having you in our alumni community!\n\nBest regards,\nPSG Tech Alumni Association Team`,
      },
        (error) => {
          if (error) return res.status(500).send("Error sending OTP email.");
          res.status(200).send("OTP sent.");
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error.");
    }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
      const user = await User2.findOne({ email });
      if (!user || !user.isVerified) 
          return res.status(400).json({ message: "User not found or not verified." });

      const validPassword = await user.comparePassword(password);
      if (!validPassword) 
          return res.status(400).json({ message: "Invalid credentials." });

      // If user is an Admin, redirect to admin home
      if (user.role === "Admin") {
          const token = jwt.sign({ email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "1h" });
          return res.status(200).json({ token, redirectTo: "/admin-home" });
      }

      // If user is an Alumni, check approval status
      if (user.role === "Alumni") {
          const alumni = await Alumni.findOne({ email });
          
          if (!alumni) {
              return res.status(400).json({
                  message: "Alumni profile not found. Please complete registration.",
                  redirectTo: "/alumniregistration",
              });
          }

          if (alumni.approval_status === "pending") {
              return res.status(403).json({ 
                  message: "Your profile is not approved by admin. Please wait for approval. You will receive an email once approved." 
              });
          }
      }

      // Generate token for other users (Students, Staff, etc.)
      const token = jwt.sign({ email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });

  } catch (error) {
      res.status(500).json({ message: "Server error." });
  }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
      try {
        const user = await User2.findOne({ email });
        if (!user) return res.status(400).send("User not registered.");
    
        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
    
        transporter.sendMail({
            from: process.env.BALAMURUGAN_EMAIL,
            to: email,
            subject: "PSG Tech Alumni Association - Password Reset Request",
            text: `Dear ${user.name},\n\nWe received a request to reset your password for the PSG Tech Alumni Association account.\n\nTo reset your password, click the link below:\n🔗 http://localhost:3000/reset-password?token=${resetToken}\n\nThis link is valid for 5 minutes. If you did not request a password reset, please ignore this email.\n\nFor any assistance, feel free to contact us.\n\nBest regards,\nPSG Tech Alumni Association Team`,
          },
          (error) => {
            if (error) return res.status(500).send("Error sending email.");
            res.status(200).send("Password reset link sent.");
          }
        );
      } catch (error) {
        res.status(500).send("Server error.");
      }
};

exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
      const { token } = req.query;
    
      if (!token) return res.status(400).send("Token is required.");
    
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User2.findOne({ email: decoded.email });
    
        if (!user) return res.status(400).send("Invalid token.");
    
        user.password = newPassword;
        await user.save();
        res.status(200).send("Password updated.");
      } catch (error) {
        res.status(400).send("Invalid or expired token.");
      }
      
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User2.findOne({ email });

    if (!user) return res.status(400).send("User not registered.");
    if (user.isVerified) return res.status(400).send("Account already verified.");
    
    if (Date.now() > user.otpExpiry) {
      await User2.deleteOne({ email });
      return res.status(400).send("OTP expired. Please sign up again.");
    }
    
    if (user.otp !== otp) return res.status(400).send("Invalid OTP.");

    user.isVerified = true;
    user.clearOTP();
    await user.save();
    
    res.status(200).send("Account verified.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

// Email sending function
exports.sendEmail = async (req, res) => {
  try {
    const { email, profile } = req.body;
    if (!email || !profile) throw new Error("Email and profile are required");

    let emailBody = `Dear User,\n\nHere is the suggested alumni profile:\n\n`;
    Object.keys(profile).forEach((key) => {
      emailBody += `${key}: ${profile[key]}\n`;
    });
    emailBody += `\nBest regards,\nAlumni Team`;

    const mailOptions = {
      from: process.env.BALAMURUGAN_EMAIL,
      to: email,
      subject: "Suggested Alumni Profile",
      text: emailBody,
    };
    console.log("📨 Sending email to:", email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    res.json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

// Export the function correctly
//module.exports = { sendEmail };

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.checkUserExists = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token using Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Must match frontend OAuth Client ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { email, name, picture, sub } = payload;
    const userDomain = email.split("@")[1];
    const allowedDomains = ["gmail.com", "psgtech.ac.in"];

    if (!allowedDomains.includes(userDomain)) {
      return res.status(403).json({ message: "Access denied. Use an allowed email domain." });
    }

    // Check if user exists in database
    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        message: "User found",
        userExists: true,
        user,
      });
    } else {
      return res.json({
        message: "User not found",
        userExists: false,
        user: { email, name, picture, role: "user", id: sub },
      });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

