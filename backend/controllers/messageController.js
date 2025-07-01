const User = require("../models/User");
const Message = require("../models/Message");
const Connection = require("../models/Connection");
const mongoose = require("mongoose");

const sendMessage = async (req, res) => {
  console.log("inside send function");
  const { senderId, receiverId, message } = req.body;
  console.log("Sender ID:", senderId);
  console.log("Receiver ID:", receiverId);
  console.log("Message:", message);

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "firstName lastName photo")
      .populate("receiverId", "firstName lastName photo");

    res.status(200).json(populatedMessage);

    // res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getMessages = async (req, res) => {
//   const { senderId, receiverId } = req.params;

//   console.log("sender id : "+senderId);
//   console.log("receiver id :"+receiverId);
//   if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
//     // return res.status(400).json({ message: "Invalid user ID" });
//     console.log("invalid user id");
//   }

  

//   try {
//     const senderObjectId = new mongoose.Types.ObjectId(senderId);
//     const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
//     const messages = await Message.find({
//       $or: [
//         { senderId: senderObjectId , receiverId: receiverObjectId },
//         { senderId: receiverObjectId , receiverId: senderObjectId },
//       ]
//     })
//       .sort({ timestamp: 1 }) // Ascending order by timestamp
//       .populate("senderId", "firstName lastName photo")
//       .populate("receiverId", "firstName lastName photo");

//     console.log(messages);

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query; // ✅ use query if you're sending via axios.get with `params`

  console.log("senderId:", senderId);
  console.log("receiverId:", receiverId);

  // Validate MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid sender or receiver ID" });
  }

  try {
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const messages = await Message.find({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId },
        { senderId: receiverObjectId, receiverId: senderObjectId },
      ],
    })
      .sort({ timestamp: 1 }) // Oldest to newest
      .populate("senderId", "firstName lastName photo")
      .populate("receiverId", "firstName lastName photo");

    console.log(messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    sendMessage,
    getMessages,
}