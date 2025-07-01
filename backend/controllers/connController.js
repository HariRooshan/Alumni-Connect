const User = require("../models/User");
const Connection = require("../models/Connection");
const mongoose = require("mongoose");

const getConnectionById = async (req, res) => {
    try {
      // console.log("Hi 2");.
      const { connectionId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(connectionId)) {
        return res.status(400).json({ message: "Invalid connectionId format" });
      }
      
      // sinle line alternative for fetching connection by id
      const conn = await Connection.findById(connectionId);
      console.log("connection : "+conn);
  
      if (!conn) {
        return res.status(404).json({ message: "No connection requests found with given id." });
      }
  
      res.status(200).json(conn); // send connection request
    } catch (error) {
      console.error("Error fetching connection :", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const sendConnectionRequest = async (req, res) => {
    try {
      const { senderEmail, receiverId, message } = req.body;
  
      const sender = await User.findOne({ email: senderEmail });
      const receiver = await User.findById(receiverId);
  
      console.log(sender, receiver);
      console.log("Msg received : ", message);
  
      if (!sender || !receiver) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const senderId = sender._id; 
  
      const existingRequest = await Connection.findOne({ senderId, receiverId, status: "pending" });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already sent" });
      }
  
      const existingRequest2 = await Connection.findOne({ senderId, receiverId, status: "accepted" });
      if (existingRequest2) {
        return res.status(400).json({ message: "Connection already exist" });
      }
  
       // Create a new connection request
       const newConnection = new Connection({
        senderId,
        receiverId,
        senderName: sender.firstName + " " + sender.lastName,
        message,
        status: "pending",
      });
  
      await newConnection.save();
      res.status(200).json({ message: "Connection request sent" });
    } catch (error) {
      console.error("Error sending connection request:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const fetchPendingRequests = async (req, res) => {
  try {
    // console.log("Hi 1");
    const { receiverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiverId format" });
    }

    // Convert to ObjectId
    const receiverId_id = new mongoose.Types.ObjectId(receiverId);

    // Fetch all pending connection requests for the receiver
    const pendingRequests = await Connection.find({
      receiverId: receiverId_id,
      status: "pending", // Only fetch requests that are still pending
    })
    // .populate("senderId", "firstName lastName email picture"); // Optionally populate sender details

    if (!pendingRequests) {
      return res.status(404).json({ message: "No pending connection requests found." });
    }
    // console.log(pendingRequests);

    res.status(200).json(pendingRequests); // Send the list of pending requests
  } catch (error) {
    console.error("Error fetching pending connection requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const respondConnectionRequest = async (req, res) => {
  try {
    const { connectionId , action } = req.body; // action = "accept" or "reject"

    const conn = await Connection.findById(connectionId);
    if(conn.status !== "pending"){
      return res.status(400).json({ message: "Request already responded" });
    }

    const mentorId = conn.receiverId;
    const menteeId = conn.senderId;

    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    if (action === "accept") {
      // 🔹 Ensure the connection is mutual
      if (!mentor.connections.includes(menteeId)) {
        mentor.connections.push(menteeId);
      }
      if (!mentee.connections.includes(mentorId)) {
        mentee.connections.push(mentorId);
      }

      conn.status = "accepted";
      await mentee.save(); // Save mentee's updated connections
    }

    else{
      conn.status = "rejected";
    }

    console.log(conn);

    await mentor.save();
    await conn.save();

    res.status(200).json({
      message: action === "accept" ? "Request accepted" : "Request rejected",
    });
  } catch (error) {
    console.error("Error responding to connection request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchEstablishedConnections = async (req, res) => {
  try {
    // console.log("Hi 12");
    const { userId } = req.params;

    const user = await User.findById(userId).populate("connections", "firstName lastName role meetingMethod skills photo");

    // console.log("user data with connections "+user);

    if (!user) {
      return res.status(404).json({ message: "No connection requests found with given id." });
    }

    res.status(200).json(user); // Send the list of pending requests
  } catch (error) {
    console.error("Error fetching connection :", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
    getConnectionById,
    sendConnectionRequest,
    fetchPendingRequests,
    respondConnectionRequest,
    fetchEstablishedConnections
    // add other functions here
}