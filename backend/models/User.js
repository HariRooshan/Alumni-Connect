const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName : { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  skills: [String], // Array of selected skills
  photo: String, // URL to the profile photo (axcesed via google login).
  experienceOrYear: String,
  industryOrDepartment: String, // Only for Mentors
  meetingMethod: String, // Online / Offline
  education: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Connection list
});

module.exports = mongoose.model("User", UserSchema);
