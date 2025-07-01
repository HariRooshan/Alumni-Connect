const mongoose = require("mongoose");

const ContactInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model("ContactInfo", ContactInfoSchema);