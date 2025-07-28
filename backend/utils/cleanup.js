const User2 = require("../models/User_main");
const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

// Remove unverified users whose OTP has expired
const cleanupExpiredUsers = async () => {
  try {
    const expiredUsers = await User2.find({ isVerified: false, otpExpiry: { $lt: Date.now() } });
    for (const user of expiredUsers) {
      console.log(`🗑 Removing expired user: ${user.email}`);
      await User2.deleteOne({ email: user.email });
    }
  } catch (error) {
    console.error("❌ Error cleaning up expired users:", error);
  }
};

// Remove events older than 5 years and delete their attachments
const cleanupOldEvents = async () => {
  try {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const oldEvents = await Event.find({ date: { $lt: fiveYearsAgo } });

    for (const event of oldEvents) {
      if (event.attachment) {
        const filePath = path.join(uploadDir, event.attachment);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑 Deleted attachment: ${filePath}`);
        }
      }

      await Event.findByIdAndDelete(event._id);
      console.log(`🗑 Deleted event: ${event.title}`);
    }

  } catch (error) {
    console.error("❌ Error cleaning up old events:", error);
  }
};

// Run cleanup tasks every 48 hours
setInterval(async () => {
  console.log("🧹 Running cleanup tasks...");
  await cleanupExpiredUsers();
  await cleanupOldEvents();
}, 48 * 60 * 60 * 1000); 

// Run once immediately on startup
cleanupExpiredUsers();
cleanupOldEvents();

module.exports = {
  cleanupExpiredUsers,
  cleanupOldEvents
};
