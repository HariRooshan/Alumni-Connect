import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
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
                (() => {
                let lastDate = null;
                return messages.map((msg, index) => {
                    const msgDate = new Date(msg.timestamp);
                    const dateLabel = isToday(msgDate)
                    ? "Today"
                    : isYesterday(msgDate)
                    ? "Yesterday"
                    : format(msgDate, "dd MMM yyyy");
                    const showDateDivider = !lastDate || format(msgDate, "yyyy-MM-dd") !== format(lastDate, "yyyy-MM-dd");
                    lastDate = msgDate;
                    const isSender = msg.senderId._id === currentUserId;
                    return (
                    <div key={index}>
                        {showDateDivider && (
                        <Box sx={{ textAlign: "center", my: 1 }}>
                            <Typography
                            variant="caption"
                            sx={{
                                background: "#e0e0e0",
                                borderRadius: 2,
                                px: 2,
                                py: 0.5,
                                color: "#555",
                                fontWeight: 600,
                            }}
                            >
                            {dateLabel}
                            </Typography>
                        </Box>
                        )}
                        <Box
                        sx={{
                            textAlign: isSender ? "right" : "left",
                        }}
                        >
                        <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                            {isSender ? "You" : `${msg.senderId.firstName} ${msg.senderId.lastName}`}
                        </Typography>
                        <Box sx={{ display: "inline-block", maxWidth: "80%" }}>
                            <Typography
                            sx={{
                                wordBreak: "break-word",
                                backgroundColor: "#f1f1f1",
                                p: 1,
                                borderRadius: 1,
                                display: "inline-block",
                            }}
                            >
                            {msg.message}
                            <span style={{
                                fontSize: 11,
                                color: "#888",
                                marginLeft: 10,
                                marginTop: 8,
                                float: "right",
                            }}>
                                {format(msgDate, "hh:mm a")}
                            </span>
                            </Typography>
                        </Box>
                        </Box>
                    </div>
                    );
                });
                })()
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