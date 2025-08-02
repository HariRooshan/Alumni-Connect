// const express = require("express");
// const {
//   getAllEvents,
//   getEventById,
//   createEvent,
//   updateEvent,
//   deleteEvent,
// } = require("../controllers/eventController");
// const multer = require("multer");

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// const router = express.Router();

// // Event routes
// router.get("/", getAllEvents);
// router.get("/:id", getEventById);
// router.post("/", upload.single("attachment"), createEvent);
// router.put("/:id", upload.single("attachment"), updateEvent);
// router.delete("/:id", deleteEvent);

// module.exports = router;


// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Import controller functions
const eventController = require("../controllers/eventController");

// Define routes
router.get("/", eventController.getAllEvents);
router.post("/", upload.single("attachment"), eventController.createEvent);
router.put("/:id", upload.single("attachment"), eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.delete("/:id/attachment", eventController.deleteAttachment);
module.exports = router;