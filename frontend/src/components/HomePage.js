import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Fade // Import Fade transition
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const [galleryImages, setGalleryImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    // Fetch gallery images
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gallery/photos");
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          setGalleryImages(data.photos.sort(() => 0.5 - Math.random()).slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    // Fetch events
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        // Filter for upcoming events (date >= today)
        const today = new Date();
        const upcomingEvents = data.filter(
          (event) => new Date(event.date) >= today
        );
        setEvents(upcomingEvents);
        setLoadingEvents(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoadingEvents(false);
      }
    };

    fetchGalleryImages();
    fetchEvents();
  }, []);

  // Cycle through upcoming events every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (events.length > 0) {
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [events]);

  // Determine which event to show
  const upcomingEvent = events.length > 0 ? events[currentEventIndex] : null;

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: "url('collegepic.png')",
          height: "50vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)"
          }}
        ></div>
        <div style={{ zIndex: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            Welcome to PSG Tech Alumni Association
          </Typography>
          <Typography variant="h6" mt={2}>
            Stay connected, give back, and grow together!
          </Typography>
        </div>
      </div>

      {/* About Us Section */}
      <Container sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h4" color="primary">
          About Us
        </Typography>
        <Typography variant="body1" maxWidth="md" mx="auto" mt={2}>
          The PSG Tech Alumni Association fosters lifelong connections between alumni, faculty, and students. Join us to participate in events, mentorship programs, and career support initiatives.
        </Typography>
      </Container>

      {/* Main Content Grid */}
      <Container sx={{mb:3}}>
        <Grid container spacing={4} justifyContent="center">
          {/* Upcoming Events Section with Fade Transition */}
          <Grid item xs={12} md={4}>
            {loadingEvents ? (
              <CircularProgress />
            ) : upcomingEvent ? (
              // Fade will trigger whenever the key (based on upcomingEvent._id) changes
              <Fade in={true} timeout={1000} key={upcomingEvent._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Upcoming Events
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                      {new Date(upcomingEvent.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      {upcomingEvent.title}
                    </Typography>
                    <Typography variant="body2">
                      Venue: {upcomingEvent.location}
                    </Typography>
                    <Button
                      component={Link}
                      to="/events"
                      sx={{ mt: 2 }}
                      color="primary"
                    >
                      View More Events
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    No Upcoming Events
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Gallery Slideshow */}
          <Grid item xs={12} md={4}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
              }}
            >
              {galleryImages.length > 0 ? (
                galleryImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.src}
                      alt={image.filename}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover"
                      }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    src="/placeholder.svg"
                    alt="No images available"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />
                </SwiperSlide>
              )}
            </Swiper>
          </Grid>

          {/* Alumni Access Section */}
          {!token && (
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Alumni Access
                  </Typography>
                  <Typography variant="body2" mt={2}>
                    Join our alumni portal for exclusive access to events, career resources, and networking opportunities.
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: "#6a0dad" }}
                  >
                    Login / Sign Up
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;