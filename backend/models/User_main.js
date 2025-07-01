const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
// Define User Schema with improvements
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    role: { type: String, enum: ["Student", "Staff", "Alumni","Admin"], default: "student" },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Check if reset token is still valid
userSchema.methods.isResetTokenValid = function () {
  return this.resetPasswordExpiry && this.resetPasswordExpiry > Date.now();
};

// ⏳ Clear OTP after use
userSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpiry = null;
};


module.exports = mongoose.model("User2", userSchema);
