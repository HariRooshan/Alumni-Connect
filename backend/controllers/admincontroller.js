const Alumni = require("../models/Alumni");
const User2 = require("../models/User_main");
const transporter = require("../config/transporter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const ContactInfo = require("../models/ContactInfo");

// Get Contact Info
exports.getContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findOne();
    if (!contact) return res.status(404).json({ message: "Contact info not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact info", error });
  }
};
// Update Contact Info (Admin only)
exports.updateContactInfo = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Check if required fields are provided
    if (!email || !phone) {
      return res.status(400).json({ 
        message: "Email and phone are required fields." 
      });
    }

    let contact = await ContactInfo.findOne();
    
    // If no contact info exists, create a new one
    if (!contact) {
      contact = new ContactInfo({ email, phone });
    } else {
      contact.email = email;
      contact.phone = phone;
    }

    await contact.save();
    res.json({ message: "Contact info updated successfully", contact });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating contact info", 
      error: error.message 
    });
  }
};

exports.approveAlumni = async (req, res) => {
    const { status } = req.body; // "approved" or "rejected"
  
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send("Invalid status.");
    }
  
    try {
      const alumni = await Alumni.findById(req.params.id);
      if (!alumni) {
        return res.status(404).send("Alumni not found.");
      }
  
      if (status === "rejected") {
        const registrationFormLink = `http://localhost:3000/signup`; // Redirect to signup page
  
        // Send rejection email with re-signup link
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: alumni.email,
          subject: "Alumni Registration Rejected - Signup Again",
          text: `Dear ${alumni.name},\n\nWe regret to inform you that your alumni registration has been rejected due to verification issues. Your user account has been removed from our system.\n\nHowever, you are welcome to sign up again with valid details.\n\nClick the link below to sign up again:\n${registrationFormLink}\n\nIf you have any questions, please contact the administration.\n\nBest regards,\nAdmin Team`,
        };
  
        await transporter.sendMail(mailOptions);
  
        // Remove alumni entry from the database
        await Alumni.findByIdAndDelete(req.params.id);
  
        // Remove the user from the User collection
        await User2.findOneAndDelete({ email: alumni.email });
  
        return res.send("Alumni rejected, user deleted, email sent with re-signup link.");
      }
      
      const alumniDashboardLink = `http://localhost:3000/login`; // Redirect to alumni dashboard
      
        // Send approval email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: alumni.email,
        subject: "Alumni Registration Approved - Welcome!",
        text: `Dear ${alumni.name},\n\nCongratulations! Your alumni registration has been successfully approved.\n\nYou can now login and access your alumni portal.\n\nClick the link below to log in:\n${alumniDashboardLink}\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nAdmin Team`,
      };
      
      await transporter.sendMail(mailOptions);
      
      
      
  
      // If approved, update status
      alumni.approval_status = status;
      await alumni.save();
  
      res.send(`Alumni ${status} successfully.`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error.");
    }
  };
  
  exports.getApprovedAlumni = async (req, res) => {
    try {
      const approvedAlumni = await Alumni.find({ approval_status: "approved" });
      res.json(approvedAlumni);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error.");
    }
  };
  
  exports.getPendingAlumni = async (req, res) => {
    try {
        const { graduationYear, programStudied, name, rollNumber } = req.query;
        let filter = { approval_status: "pending" };

        if (graduationYear) {
            filter.yearOfGraduation = graduationYear;
        }
        if (programStudied) {
            filter.programStudied = { $regex: new RegExp(programStudied, "i") }; // Case-insensitive search
        }
        if (name) {
            filter.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }
        if (rollNumber) { // ✅ Corrected this condition
            filter.rollNumber = { $regex: new RegExp(rollNumber, "i") }; // Case-insensitive search
        }

        const pendingAlumni = await Alumni.find(filter);
        res.json(pendingAlumni);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};

