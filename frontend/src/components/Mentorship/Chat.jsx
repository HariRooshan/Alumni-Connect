// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { TextField, Button, Box, Typography, Paper } from "@mui/material";

// const socket = io("http://localhost:5000"); // Connect to backend

// const Chat = () => {
//     const { senderId,receiverId } = useParams(); // Get connectionId from URL
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

    

//     useEffect(() => {

//         console.log(sessionStorage.getItem("id"));
//         console.log(senderId);
//         console.log(receiverId);

//         // Fetch past messages
//         const res = axios.get(`http://localhost:5000/api/chat/get`,{
//             params: {senderId: senderId ,receiverId: receiverId}
//         })

//         console.log(res);
        
//         setMessages(res.data);
//         // Fetch past messages
//         // axios.get(`http://localhost:5000/api/chat/get/${connectionId}`)
//         //     .then((res) => setMessages(res.data))
//         //     .catch((err) => console.error("Error fetching messages:", err));

//         // Join the chat room for this connection
//         // socket.emit("joinRoom", connectionId);

//         // Listen for new messages
//         socket.on("receiveMessage", (message) => {
//             setMessages((prevMessages) => [...prevMessages, message]);
//         });

//         return () => {
//             socket.off("receiveMessage");
//         };
//     }, [senderId,receiverId]);

//     // Send a message
//     const sendMessage = async () => {

//         console.log("Sending message : ", newMessage);
//         if (!newMessage.trim()) return;

//         const messageData = {
//             receiverId: receiverId,
//             senderId: senderId, // Current user ID
//             message: newMessage,
//             timestamp: new Date(),
//         };

//         try {
//             // Save message to the database
//             const res = await axios.post("http://localhost:5000/api/chat/send", {
//                 senderId,
//                 receiverId,
//                 message: newMessage
//             });

//             // Emit message to other users
//             socket.emit("sendMessage", messageData);

//             // Update UI instantly
//             setMessages((prev) => [...prev, messageData]);
//             setNewMessage("");
//         } catch (err) {
//             console.error("Error sending message:", err);
//         }
//     };


//     return (
//         <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//                 Chat Room
//             </Typography>
    
//             {/* Debugging: Logs messages array */}
//             {console.log("🔹 Chat Messages Array:", messages)}
    
//             <Paper 
//                 sx={{ 
//                     height: 400, 
//                     overflowY: "auto", 
//                     padding: 2, 
//                     mb: 2, 
//                     border: "2px solid blue" // Debugging: Visible border
//                 }}
//             >
//                 {messages.length === 0 ? (
//                     <>
//                         {console.log("ℹ️ No messages available.")}
//                         <Typography>No messages yet.</Typography>
//                     </>
//                 ) : (
//                     messages.map((msg, index) => {
//                         console.log(`📩 Message ${index + 1}:`, msg);
//                         console.log("📤 Sender ID:", msg.senderId);
//                         console.log("🆔 Current User ID:", sessionStorage.getItem("id"));
                        
//                         console.log(msg.senderId===sessionStorage.getItem("id"));
    
//                         return (
//                             <Box 
//                                 key={index} 
//                                 sx={{ 
//                                     mb: 1, 
//                                     textAlign: msg.senderId === sessionStorage.getItem("id") ? "right" : "left",
//                                 }}
//                             >
//                                 <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
//                                     {msg.senderId === sessionStorage.getItem("id") ? "You" : "Mentor/Mentee"}
//                                 </Typography>
//                                 <Typography sx={{ wordBreak: "break-word", backgroundColor: "#f1f1f1", p: 1, borderRadius: 1 }}>
//                                     {msg.message}
//                                 </Typography>
//                             </Box>
//                         );
//                     })
//                 )}
//             </Paper>
    
//             {/* Debugging: Logs newMessage state */}
//             {console.log("📝 New Message Input:", newMessage)}
    
//             <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Type a message..."
//                 value={newMessage}
//                 onChange={(e) => {
//                     setNewMessage(e.target.value);
//                     console.log("📝 Updated Message:", e.target.value);
//                 }}
//             />
    
//             <Button 
//                 onClick={() => {
//                     console.log("📨 Sending Message:", newMessage);
//                     sendMessage();
//                 }} 
//                 variant="contained" 
//                 sx={{ mt: 1, width: "100%" }}
//             >
//                 Send
//             </Button>
//         </Box>
//     );
    
// };

// export default Chat;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

// Connect to backend socket
const socket = io("http://localhost:5000");

const Chat = () => {
    const { senderId, receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/chat/get", {
                    params: { senderId, receiverId },
                });
                console.log(res.data);
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();

        // Socket: listen for new messages
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [senderId, receiverId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderId,
            receiverId,
            message: newMessage,
            timestamp: new Date(),
        };

        try {
            const res = await axios.post("http://localhost:5000/api/chat/send", {
                senderId,
                receiverId,
                message: newMessage,
            });

            socket.emit("sendMessage", messageData);
            setMessages((prev) => [...prev, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const currentUserId = sessionStorage.getItem("id");

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Chat Room
            </Typography>

            <Paper sx={{ height: 400, overflowY: "auto", padding: 2, mb: 2 }}>
                {messages.length === 0 ? (
                    <Typography>No messages yet.</Typography>
                ) : (
                    messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 1,
                                textAlign: msg.senderId._id === currentUserId ? "right" : "left",
                            }}
                        >
                            <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                                {msg.senderId._id === currentUserId ? "You" : `${msg.senderId.firstName} ${msg.senderId.lastName}`}
                            </Typography>
                            <Typography sx={{ wordBreak: "break-word", backgroundColor: "#f1f1f1", p: 1, borderRadius: 1 }}>
                                {msg.message}
                            </Typography>
                        </Box>
                    ))
                )}
            </Paper>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />

            <Button onClick={sendMessage} variant="contained" sx={{ mt: 1, width: "100%" }}>
                Send
            </Button>
        </Box>
    );
};

export default Chat;
