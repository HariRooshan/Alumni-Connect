import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EventForm from "./EventForm";
import EventTable from "./EventTable";
import * as eventService from "../services/eventService";

// Create a custom styled button with enhanced UI
const CustomButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "capitalize",
  fontSize: "1rem",
  padding: theme.spacing(1, 2),
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  transition: "background-color 0.3s, transform 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0px 6px 10px rgba(0,0,0,0.15)",
  },
}));

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await eventService.getAllEvents();
    setEvents(data);
  };

  const addOrEditEvent = async (eventFormData) => {
    console.log("Checking Event before update:", Object.fromEntries(eventFormData));
  
    const id = eventFormData.get("_id"); // 🔹 Extract _id from FormData
  
    if (id) {
      console.log("Updating event with ID:", id);
      await eventService.updateEvent(eventFormData, id);
    } else {
      console.log("Inserting new event");
      await eventService.insertEvent(eventFormData);
    }
  
    setOpenPopup(false);
    setRecordForEdit(null);
    fetchEvents();
  };
  const handleDelete = async (eventId) => {
    console.log("Attempting to delete event with ID:", eventId);
    await eventService.deleteEvent(eventId);
    setEvents(events.filter((event) => event._id !== eventId));
  };

  const handleEdit = (event,id) => {
    console.log("Editing Event:", event);
  console.log("Event ID:", id);

  const eventToEdit = { ...event, _id: id };
  setRecordForEdit(eventToEdit);
  setCurrentEvent(eventToEdit);
  setOpenPopup(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header with Larger Text */}
      <Box
        sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          padding: "16px", // Increased padding for better spacing
          borderRadius: "8px",
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold" color="white">
          Admin - Manage Alumni Events
        </Typography>
      </Box>

      {/* Centered Add Event Button with Larger Size */}
      <Box sx={{ textAlign: "center" }}>
        <CustomButton
          color="primary"
          onClick={() => {
            setOpenPopup(true);
            setCurrentEvent(null);
          }}
          sx={{
            padding: "12px 24px", // Larger button padding
            fontSize: "1.2rem", // Increased font size
            borderRadius: "8px",
          }}
        >
          Add Event
        </CustomButton>
      </Box>

      <EventTable events={events} handleEdit={handleEdit} handleDelete={handleDelete} />

      {/* Event Form Dialog */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          <EventForm eventForEdit={recordForEdit} addOrEdit={addOrEditEvent} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default AdminPage;