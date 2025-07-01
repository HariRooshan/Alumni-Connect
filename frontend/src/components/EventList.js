import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Button, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, Grid, CircularProgress, 
  TextField, MenuItem, Select, FormControl, InputLabel 
} from "@mui/material";
import axios from "axios";



const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Upcoming, Completed, or All
  const [sortBy, setSortBy] = useState("date-newest");

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleOpenPopup = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClosePopup = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const today = new Date();

  const filteredEvents = events
    .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(event => 
      eventTypeFilter ? event.eventType.toLowerCase() === eventTypeFilter.toLowerCase() : true
    )
    .filter(event => 
      yearFilter ? event.passedOutYear?.toString() === yearFilter : true
    )
    .filter(event => {
      const eventDate = new Date(event.date);
      if (statusFilter === "upcoming") return eventDate >= today;
      if (statusFilter === "completed") return eventDate < today;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date-newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        🎉 Upcoming Events
      </Typography>

      {/* Search, Filter & Sort Controls */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="🔍 Search Events" 
            variant="outlined" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <InputLabel>🎭 Filter by Type</InputLabel>
            <Select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Seminar">Seminar</MenuItem>
              <MenuItem value="Meetup">Meetup</MenuItem>
              <MenuItem value="Webinar">Webinar</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <InputLabel>📆 Event Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Grid Layout - 2 Events Per Row */}
      <Grid container spacing={4} justifyContent="center" sx={{pb:10,pt:5}}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} key={event._id}>
            <Card 
              sx={{ 
                height: "100%", borderRadius: "12px", 
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", 
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.03)" }
              }}
            >
              <CardContent sx={{ textAlign: "left", padding: "20px" }}>
                <Typography variant="h5" fontWeight="bold">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#125ea7" }}}
                  onClick={() => handleOpenPopup(event)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClosePopup} fullWidth maxWidth="sm">
        {selectedEvent && (
          <>
            <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "primary.main" }}>
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent sx={{ padding: "20px", textAlign: "center" }}>
              {selectedEvent.attachment && (
                <img 
                  src={`http://localhost:5000${selectedEvent.attachment}`} 
                  alt={selectedEvent.title} 
                  style={{ width: "100%", cursor: "pointer", borderRadius: "8px" }} 
                  onClick={() => window.open(`http://localhost:5000${selectedEvent.attachment}`, "_blank")}
                />
              )}
              <Typography variant="body1" sx={{ fontSize: "16px", color: "text.secondary", mb: 2 }}>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                📅 {new Date(selectedEvent.date).toLocaleDateString()} | 📍 {selectedEvent.location}
              </Typography>
              <Typography variant="body2">
                <strong>Event Type:</strong> {selectedEvent.eventType}
              </Typography>
              <Typography variant="body2">
                <strong>Passed Out Year:</strong> {selectedEvent.passedOutYear || "Any"}
              </Typography>
              <Typography variant="h6" color="primary">📞 For Booking Contact Us</Typography>
              <Typography variant="body2"><strong>Phone:</strong> 9000000000</Typography>
              <Typography variant="body2"><strong>Email:</strong> alumni.events@example.com</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EventList;
