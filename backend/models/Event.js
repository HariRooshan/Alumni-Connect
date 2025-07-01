const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  eventType: { type: String, required: true },
  passedOutYear: { type: String, required: false },
  attachment: { type: String, required: false },  // stores relative path, e.g., "/uploads/filename.jpg"
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;