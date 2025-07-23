require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const adminRoutes= require("./routes/adminRoutes");
const galleryRoutes= require("./routes/galleryRoutes");
const eventRoutes= require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const connRoutes = require("./routes/connRoutes");
const emailRoutes = require("./routes/emailRoutes");
const messageRoutes = require("./routes/messageRoutes");
// const eventRoutes= require("./routes/eventRoutes");



const app = express();
app.use(express.json());
app.use(cors());
// Set correct uploads path

const uploadPath = "D:/Hari/Projects/Alumni-website/Ip_project - Copy (1)/Ip_project - Copy/backend/uploads"; 
app.use('/uploads', express.static(uploadPath)); // This ensures images load correctly

// Ensure uploads directory exists
 if (!fs.existsSync(uploadPath)) {
   fs.mkdirSync(uploadPath, { recursive: true });
 }

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/gallery",galleryRoutes);
app.use('/allPhotos', express.static('uploads/allPhotos'));
app.use('/albums', express.static('uploads/albums'));
app.use("/api/events", eventRoutes);

app.use("/api/users", userRoutes);
app.use("/api/connections",connRoutes)
app.use("/api/mail",emailRoutes);
app.use("/api/chat",messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔹 SOCKET.IO INTEGRATION
io.on("connection", (socket) => {
  console.log(`🔵 User Connected: ${socket.id}`);

  // Listen for new messages
  socket.on("sendMessage", (data) => {
      console.log(`📨 New Message from ${data.senderId}:`, data.message);

      // Emit message to the receiver
      io.to(data.connectionId).emit("receiveMessage", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// Start cleanup service
require("./utils/cleanup"); // This will automatically start cleanup on server start

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



