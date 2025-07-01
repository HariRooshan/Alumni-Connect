const express = require("express");
const router = express.Router();
const {getConnectionById,sendConnectionRequest,fetchPendingRequests,respondConnectionRequest,fetchEstablishedConnections} = require("../controllers/connController")

// 🔹 Send Connection Request
router.post("/request", sendConnectionRequest);

// 🔹 Fetch Pending Connection Requests
router.get("/pending/:receiverId", fetchPendingRequests);

// 🔹 Fetch Connection by connection id
router.get("/:connectionId", getConnectionById);

// 🔹 Accept or Reject Connection Request
router.post("/respond", respondConnectionRequest);

// 🔹 Fetch established Connection
router.get("/fetch/:userId", fetchEstablishedConnections);
  
module.exports = router;