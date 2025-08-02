import { useNavigate } from "react-router-dom"; // ⬅️ Add this
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


// Connect to backend socket
const socket = io("http://localhost:5000");

const Chat = () => {

    const navigate = useNavigate(); // ⬅️ Initialize navigation

    const handleBack = () => {
        navigate(-1); // ⬅️ Go back to the previous page
    };

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
        <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
                mb: 2,
                background: "linear-gradient(45deg, #8e2de2, #4a00e0)",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                background: "linear-gradient(45deg, #7b1fa2, #311b92)",
                },
            }}
            >
            Back
        </Button>

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

// draft 3 - message timestamp and sender name


// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const socket = io("http://localhost:5000");

// const Chat = () => {
//   const { senderId, receiverId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const currentUserId = sessionStorage.getItem("id");
//   const chatEndRef = useRef(null);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/chat/get", {
//           params: { senderId, receiverId },
//         });
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };

//     fetchMessages();

//     socket.on("receiveMessage", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [senderId, receiverId]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const messageData = {
//       senderId,
//       receiverId,
//       message: newMessage,
//       timestamp: new Date(),
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/chat/send", {
//         senderId,
//         receiverId,
//         message: newMessage,
//       });

//       socket.emit("sendMessage", messageData);
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(to bottom right, #f3e7e9, #e3eeff)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         pt: 3,
//       }}
//     >
//       <Box
//         sx={{
//           width: "100%",
//           maxWidth: 700,
//           borderRadius: 3,
//           overflow: "hidden",
//           boxShadow: 5,
//           backgroundColor: "white",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             background: "linear-gradient(45deg, #8e2de2, #4a00e0)",
//             color: "white",
//             px: 2,
//             py: 1.5,
//           }}
//         >
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={handleBack}
//             sx={{
//               color: "white",
//               textTransform: "none",
//               fontWeight: "bold",
//               "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
//             }}
//           >
//             Back
//           </Button>
//           <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", mr: 4 }}>
//             Chat Room
//           </Typography>
//         </Box>

//         {/* Messages */}
//         <Paper
//           sx={{
//             height: 500,
//             overflowY: "auto",
//             px: 2,
//             py: 2,
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           {messages.length === 0 ? (
//             <Typography sx={{ textAlign: "center", mt: 10, color: "gray" }}>
//               No messages yet.
//             </Typography>
//           ) : (
//             messages.map((msg, index) => {
//               const isSender = msg.senderId._id === currentUserId;
//               return (
//                 <Box
//                   key={index}
//                   sx={{
//                     display: "flex",
//                     justifyContent: isSender ? "flex-end" : "flex-start",
//                     mb: 2,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       maxWidth: "75%",
//                       p: 1.5,
//                       borderRadius: "18px",
//                       backgroundColor: isSender ? "#8e2de2" : "#e0e0e0",
//                       color: isSender ? "white" : "black",
//                       boxShadow: 2,
//                     }}
//                   >
//                     {/* Sender Name */}
//                     <Typography sx={{ fontSize: 12, fontWeight: 600, color: isSender ? "#e0d4f7" : "#666", mb: 0.5 }}>
//                         {isSender ? "You" : `${msg.senderId.firstName} ${msg.senderId.lastName}`}
//                     </Typography>

//                     {/* Message Body */}
//                     <Typography sx={{ wordBreak: "break-word", fontSize: 15, mb: 0.5 }}>
//                         {msg.message}
//                     </Typography>

//                     {/* Timestamp */}
//                     <Typography
//                       sx={{
//                         fontSize: 11,
//                         // mt: 0.5,
//                         color: isSender ? "#e0d4f7" : "gray",
//                         textAlign: "right",
//                       }}
//                     >
//                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                     </Typography>
//                   </Box>
//                 </Box>
//               );
//             })
//           )}
//           <div ref={chatEndRef} />
//         </Paper>

//         {/* Input */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             px: 2,
//             py: 1.5,
//             borderTop: "1px solid #ddd",
//             backgroundColor: "#fefefe",
//           }}
//         >
//           <TextField
//             fullWidth
//             placeholder="Type your message..."
//             variant="outlined"
//             size="small"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             sx={{
//               mr: 2,
//               backgroundColor: "#f1f1f1",
//               borderRadius: 2,
//             }}
//           />
//           <Button
//             variant="contained"
//             onClick={sendMessage}
//             sx={{
//               background: "linear-gradient(45deg, #8e2de2, #4a00e0)",
//               textTransform: "none",
//               fontWeight: "bold",
//               borderRadius: 2,
//               px: 3,
//               boxShadow: 2,
//               "&:hover": {
//                 background: "linear-gradient(45deg, #7b1fa2, #311b92)",
//               },
//             }}
//           >
//             Send
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Chat;


// draft 4 



