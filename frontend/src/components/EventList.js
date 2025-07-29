import React, { useEffect, useState } from "react";
import {
  Container, Typography, Button, Card, CardContent,
  Dialog, DialogTitle, DialogContent, Grid, CircularProgress,
  TextField, MenuItem, Select, FormControl, InputLabel, Box
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary" gutterBottom>
        🎉 Explore Our Events
      </Typography>

      {/* Filters Section */}
      <Box
        sx={{
          backgroundColor: "#ffffffff",
          p: 3,
          borderRadius: 2,
          mb: 5
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="🔍 Search by Title"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>🎭 Filter by Type</InputLabel>
              <Select
                value={eventTypeFilter}
                label="🎭 Filter by Type"
                onChange={(e) => setEventTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Seminar">Seminar</MenuItem>
                <MenuItem value="Meetup">Meetup</MenuItem>
                <MenuItem value="Webinar">Webinar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>📆 Event Status</InputLabel>
              <Select
                value={statusFilter}
                label="📆 Event Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

     {/* Event Cards */}
      {filteredEvents.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 8 }}>
          📭 No events found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 6 }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {new Date(event.date).toLocaleDateString()}<br />
                    📍 {event.location}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => handleOpenPopup(event)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClosePopup} fullWidth maxWidth="sm">
        {selectedEvent && (
          <>
            <DialogTitle sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}>
              {selectedEvent.title}
            </DialogTitle>
             <DialogContent sx={{ textAlign: "center", pb: 3 }}>
              {selectedEvent.attachment && (() => {
                const url = `http://localhost:5000${selectedEvent.attachment}`;
                const isPDF = /\.pdf$/i.test(url);
                if (isPDF) {
                  return (
                    <Box sx={{ mb: 2 }}>
                      <PictureAsPdfIcon sx={{ fontSize: 60, color: "#d32f2f" }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        PDF Attachment
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => window.open(url, "_blank")}
                      >
                        View PDF
                      </Button>
                      {/* Optional inline preview */}
                      <Box
                        component="object"
                        data={url}
                        type="application/pdf"
                        sx={{ width: "100%", height: 300, mt: 2, border: "1px solid #ccc" }}
                      />
                    </Box>
                  );
                } else {
                  return (
                    <Box
                      component="img"
                      src={url}
                      alt={selectedEvent.title}
                      sx={{
                        width: "100%",
                        borderRadius: 1,
                        mb: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(url, "_blank")}
                    />
                  );
                }
              })()}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                📅 {new Date(selectedEvent.date).toLocaleDateString()} | 📍{" "}
                {selectedEvent.location}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                🎭 <strong>Type:</strong> {selectedEvent.eventType}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary">
                  📞 Contact
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> 9000000000
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> alumni.events@example.com
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EventList;