const express = require("express");
const {getCount,getUsersByRole,registerUser,getUserByEmail,fetchUserProfileById,updateUserProfile,leaveProgram} = require("../controllers/userController")

const router = express.Router();

// fetch members count from db
router.get("/count", getCount);

// fetching user details from db
router.get("/:email", getUserByEmail);
  
// ✅ Register User
router.post("/register", registerUser);

// ✅ Get all Mentors or Mentees
router.get("/list/:role", getUsersByRole);

// ✅ Fetch User Profile by ID
router.get("/profile/:userId", fetchUserProfileById);

// ✅ Update User Profile
router.put("/update/:userId", updateUserProfile);

// ✅ Remove User from Mentorship Program
router.delete("/leave-program/:userId", leaveProgram);

module.exports = router;