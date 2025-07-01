import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Paper, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345 , pb:10}}>
      {event.image && (
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:5000${event.image}`}
          alt={event.title}
        />
      )}
      <CardContent>
        <Typography variant="h6">{event.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(event.date).toLocaleDateString()} | {event.location}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/events/${event._id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
