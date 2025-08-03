const mongoose = require("mongoose");

const galleryPhotoSchema = new mongoose.Schema({
  filename:   { type: String, required: true },
  caption:    { type: String, default: "" },
  album:      { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now },
  validated:  { type: Boolean, default: false }
});

module.exports = mongoose.model("GalleryPhoto", galleryPhotoSchema);