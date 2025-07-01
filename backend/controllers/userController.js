const User = require("../models/User");
const Connection = require("../models/Connection");
const mongoose = require("mongoose");

const getCount = async (req, res) => {
  try {
    // console.log("Fetching user counts from MongoDB..."); // Debugging line

    const mentorCount = await User.countDocuments({ role: "mentor" });
    const menteeCount = await User.countDocuments({ role: "mentee" });
    const totalUsers = mentorCount + menteeCount;

    // console.log(`Mentors: ${mentorCount}, Mentees: ${menteeCount}, Total: ${totalUsers}`); // Debugging line

    res.json({ mentorCount, menteeCount, totalUsers });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const {  
      firstName, 
      lastName,
      email, 
      role, 
      skills, 
      experienceOrYear, 
      industryOrDepartment, 
      meetingMethod, 
      education,
      photo } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already registered" });
    }

    user = new User({
      firstName,
      lastName,
      email, 
      role, 
      skills, 
      experienceOrYear, 
      industryOrDepartment, 
      meetingMethod, 
      education,
      photo,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful", user });
    console.log("User registered:", user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserByEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // 🔹 Find user in database
      const user = await User.findOne({ email });
  
      if (user) {
        // 🔹 User exists, return their details
        return res.json(user);
      } else {
        // 🔹 User not found
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error checking user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };0

const fetchUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const leaveProgram = async (req, res) => {
    try {
      const { userId } = req.params;
  
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: "User removed from mentorship program" });
    } catch (error) {
      console.error("Error removing user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = {
    getCount,
    getUsersByRole,
    registerUser,
    getUserByEmail,
    fetchUserProfileById,
    leaveProgram
};