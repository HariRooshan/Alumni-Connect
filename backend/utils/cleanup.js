const User2 = require("../models/User_main");
const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

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

setInterval(async () => {
  console.log("🧹 Running cleanup tasks...");
  await cleanupExpiredUsers();
  await cleanupOldEvents();
}, 48 * 60 * 60 * 1000); 
cleanupExpiredUsers();
cleanupOldEvents();

module.exports = {
  cleanupExpiredUsers,
  cleanupOldEvents
};
