// const Event = require("../models/Event");
// const path = require("path");
// const fs = require("fs");

// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching events", error });
//   }
// };

// exports.getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching event", error });
//   }
// };

// exports.createEvent = async (req, res) => {
//   try {
//     const { title, description, date, location, eventType, passedOutYear } = req.body;
//     if (!title || !description || !date || !location || !eventType) {
//       return res.status(400).json({ message: "All required fields must be provided" });
//     }

//     const attachment = req.file ? `/uploads/${req.file.filename}` : null;

//     const newEvent = new Event({
//       title,
//       description,
//       date,
//       location,
//       eventType,
//       passedOutYear: passedOutYear || null,
//       attachment,
//     });

//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error("Error saving event:", error);
//     res.status(400).json({ message: "Error saving event", error });
//   }
// };

// exports.updateEvent = async (req, res) => {
//   try {
//     const { title, description, date, location, eventType, passedOutYear } = req.body;
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     if (req.file) {
//       if (event.attachment) {
//         const oldImagePath = path.join(__dirname, "..", event.attachment);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//           console.log("Deleted old image:", event.attachment);
//         }
//       }
//       event.attachment = `/uploads/${req.file.filename}`;
//     }

//     event.title = title || event.title;
//     event.description = description || event.description;
//     event.date = date || event.date;
//     event.location = location || event.location;
//     event.eventType = eventType || event.eventType;
//     event.passedOutYear = passedOutYear || event.passedOutYear;

//     await event.save();
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating event", error });
//   }
// };

// exports.deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     if (event.attachment) {
//       const imagePath = path.join(__dirname, "..", event.attachment);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//         console.log("Deleted image:", event.attachment);
//       }
//     }

//     await Event.findByIdAndDelete(req.params.id);
//     res.json({ message: "Event and associated image deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting event", error });
//   }
// };


const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, eventType, passedOutYear } = req.body;
    if (!title || !description || !date || !location || !eventType) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      eventType,
      passedOutYear: passedOutYear || null,
      attachment,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(400).json({ message: "Error saving event", error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, eventType, passedOutYear } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.file) {
      if (event.attachment) {
        const oldImagePath = path.join(__dirname, "..", event.attachment);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Deleted old image:", event.attachment);
        }
      }
      event.attachment = `/uploads/${req.file.filename}`;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.eventType = eventType || event.eventType;
    event.passedOutYear = passedOutYear || event.passedOutYear;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.attachment) {
      const imagePath = path.join(__dirname, "..", event.attachment);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Deleted image:", event.attachment);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event and associated image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
exports.deleteAttachment = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attachment) {
      return res.status(400).json({ message: "No attachment to delete" });
    }

    // remove the file from disk
    const diskPath = path.join(__dirname, "..", event.attachment);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
      console.log("🗑 Deleted attachment:", diskPath);
    }

    // clear the field in the document
    event.attachment = null;
    await event.save();

    res.json({ message: "Attachment removed" });
  } catch (err) {
    console.error("Error deleting attachment:", err);
    res.status(500).json({ message: "Server error" });
  }
};