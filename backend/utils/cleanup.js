const User2 = require("../models/User_main");

const cleanupExpiredUsers = async () => {
  try {
    const expiredUsers = await User2.find({ isVerified: false, otpExpiry: { $lt: Date.now() } });
    expiredUsers.forEach(async (user) => {
      console.log(`Removing expired user: ${user.email}`);
      await User2.deleteOne({ email: user.email });
    });
  } catch (error) {
    console.error("Error cleaning up expired users:", error);
  }
};

// Run cleanup every 48 hours
setInterval(cleanupExpiredUsers, 24 * 60 * 60 * 1000);

module.exports = cleanupExpiredUsers;
