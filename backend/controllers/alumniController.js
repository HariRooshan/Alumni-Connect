const Alumni = require("../models/Alumni");
const User2 = require("../models/User_main");
const transporter = require("../config/transporter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.registerAlumni = async (req, res) => {
  const { 
    rollNumber, 
    email, 
    name, 
    yearOfGraduation, 
    programStudied, 
    linkedinUrl, 
    job, 
    sector, 
    higherStudies, 
    institutionName, 
    degreePursued, 
    specialization, 
    yearOfCompletion 
  } = req.body;

  // Validate required fields
  if (!rollNumber || !email || !name || !yearOfGraduation || !programStudied || !linkedinUrl || !job || !sector || !higherStudies) {
    return res.status(400).send("All fields are required.");
  }

  // Validate higher studies fields if higherStudies is "Yes"
  if (higherStudies === "Yes") {
    if (!institutionName || !degreePursued || !specialization || !yearOfCompletion) {
      return res.status(400).send("Institution Name, Degree Pursued, Specialization, and Year of Completion are required if Higher Studies is Yes.");
    }
  }

  try {
    // Check if the user exists and is verified
    const user = await User2.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found. Please sign up first.");
    }
    if (!user.isVerified) {
      return res.status(400).send("User not verified. Please verify your email first.");
    }
    if (user.role !== "Alumni") {
      return res.status(400).send("Only alumni can register.");
    }

    // Check if alumni details already exist
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).send("Alumni details already registered.");
    }
    const existingRollNo = await Alumni.findOne({ rollNumber });
    if (existingRollNo) {
      return res.status(400).send("Alumni details already registered, please check your Roll Number!");
    }

    // Update name in userCredentials collection
    await User2.updateOne({ email }, { $set: { name } });

    // Save alumni details with status "pending"
    const newAlumni = new Alumni({
      rollNumber,
      email,
      name,
      yearOfGraduation,
      programStudied,
      linkedinUrl,
      job,
      sector,
      higherStudies,
      institutionName: higherStudies === "Yes" ? institutionName : "",
      degreePursued: higherStudies === "Yes" ? degreePursued : "",
      specialization: higherStudies === "Yes" ? specialization : "",
      yearOfCompletion: higherStudies === "Yes" ? yearOfCompletion : "",
      approval_status: "pending",
    });

    await newAlumni.save();
    res.status(201).send("Alumni registered successfully. Pending admin approval.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};
// ProfileView
exports.getAlumniProfile = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    let email;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      email = decodedToken.email;
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    // Find alumni by email and select required fields
    const alumni = await Alumni.findOne(
      { email },
      {
        rollNumber: 1,
        email: 1,
        name: 1,
        yearOfGraduation: 1,
        programStudied: 1,
        linkedinUrl: 1,
        job: 1,
        sector: 1,
        higherStudies: 1,
        institutionName: 1,
        degreePursued: 1,
        specialization: 1,
        yearOfCompletion: 1,
        approval_status: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    if (!alumni) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }

    res.status(200).json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// updateAlumniProfile
exports.updateAlumniProfile = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    let email;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      email = decodedToken.email;
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const updatedData = req.body;

    // Ensure institutionName, degreePursued, specialization, and yearOfCompletion are only required if higherStudies is "Yes"
    if (updatedData.higherStudies === "Yes") {
      if (!updatedData.institutionName || !updatedData.degreePursued || !updatedData.specialization || !updatedData.yearOfCompletion) {
        return res.status(400).json({ error: "All higher studies fields are required if Higher Studies is 'Yes'." });
      }
    } else {
      // If higherStudies is "No", remove the higher studies fields to prevent incorrect data storage
      updatedData.institutionName = "";
      updatedData.degreePursued = "";
      updatedData.specialization = "";
      updatedData.yearOfCompletion = "";
    }

    // Update the alumni profile
    const updatedAlumni = await Alumni.findOneAndUpdate({ email }, updatedData, { new: true });

    if (!updatedAlumni) return res.status(404).json({ error: "Profile not found." });

    // If name is updated, also update in User collection
    if (updatedData.name) {
      await User2.updateOne({ email }, { name: updatedData.name });
    }

    res.status(200).json(updatedAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

// Search alumni (or return all if no filters are provided)
exports.searchAlumni = async (req, res) => {
  try {
    const { name, yearOfGraduation, sector, higherStudies, sortOrder } = req.query;

    // Construct query dynamically
    const query = {};
    if (name) query.name = new RegExp(name, "i"); // Case-insensitive search
    if (yearOfGraduation) query.yearOfGraduation = yearOfGraduation;
    if (sector) query.sector = new RegExp(sector, "i");
    if (higherStudies) query.higherStudies = higherStudies === "Yes"; // Convert to boolean

    // Fetch only required fields with optional sorting
    let alumni = await Alumni.find(query, "rollNumber name email yearOfGraduation linkedinUrl job sector higherStudies institutionName").sort(
      sortOrder === "asc" ? { yearOfGraduation: 1 } : sortOrder === "desc" ? { yearOfGraduation: -1 } : {}
    );

    res.json(alumni);
  } catch (error) {
    console.error("Error fetching alumni data:", error);
    res.status(500).json({ message: "Error fetching alumni data", error });
  }
};



