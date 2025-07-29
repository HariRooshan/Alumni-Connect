const express = require("express");
const { signup, verifyOTP, login, forgotPassword, resetPassword,sendEmail,checkUserExists,checkUserExists2  } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-email", sendEmail);  
// new
router.post("/check-user", checkUserExists);
router.post("/check-user2",checkUserExists2)

module.exports = router;
