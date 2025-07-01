import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, Typography, Button, Card, 
  CardMedia, CardContent, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField 
} from "@mui/material";
import axios from "axios";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [registerDialog, setRegisterDialog] = useState(false);
  const [registerData, setRegisterData] = useState({ alumniName: "", email: "" });
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [id]);

  const handleOpenRegisterDialog = () => {
    setRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setRegisterDialog(false);
  };

  const handleInputChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!registerData.alumniName || !registerData.email) {
      alert("Please fill in all fields.");
      return;
    }

    setRegistering(true);

    axios.post("http://localhost:5000/api/bookings", { eventId: id, ...registerData })
      .then(() => {
        alert("Registration successful!");
        setBooked(true);
        handleCloseRegisterDialog();
      })
      .catch((error) => {
        console.error("Error registering for event:", error);
        alert("Failed to register. Please try again.");
      })
      .finally(() => {
        setRegistering(false);
      });
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        {event?.image && (
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:5000/uploads/${encodeURIComponent(event.image.split("/").pop())}`} 
            alt={event.title}
          />
        )}

        <CardContent>
          <Typography variant="h4" gutterBottom>{event?.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            📅 {new Date(event?.date).toLocaleDateString()} | 📍 {event?.location}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{event?.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Event Type:</strong> {event?.eventType}
          </Typography>
          {event?.passedOutYear && (
            <Typography variant="body2" color="text.secondary">
              <strong>Passed Out Year:</strong> {event.passedOutYear}
            </Typography>
          )}
          {event?.attachment && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <a 
                href={`http://localhost:5000/uploads/${encodeURIComponent(event.attachment.split("/").pop())}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                📎 View Attachment
              </a>
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleOpenRegisterDialog}
            disabled={booked}
          >
            {booked ? "Registered" : "Register"}
          </Button>
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={registerDialog} onClose={handleCloseRegisterDialog}>
        <DialogTitle>Register for Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            name="alumniName"
            fullWidth
            value={registerData.alumniName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={registerData.email}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegisterDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary" disabled={registering}>
            {registering ? "Registering..." : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
