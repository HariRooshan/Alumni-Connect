
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Navbar from "../NavBar";

function MentorshipDashboard() {
  const navigate = useNavigate();
  const [mentorCount, setMentorCount] = useState(0);
  const [menteeCount, setMenteeCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // ✅ Retrieve user data from session storage
  // useEffect(() => {
  //   const storedUser = sessionStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   } else {
  //     navigate("/mentorship/login"); // Redirect to login if no session exists
  //   }
  // }, [navigate]);

  useEffect(() => {
    fetchMemberCount ()
  }, []);

  const fetchMemberCount = async () => {
    try{
      const response = await fetch("http://localhost:5000/api/users/count");
      if(response.status === 404){
        console.log("Error 404 : No data found");
      }
      const result = await response.json();
      // console.log("Result:", result);
      setMentorCount(result.mentorCount);
      setMenteeCount(result.menteeCount);
      setTotalUsers(result.totalUsers);
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }
  }

  // ✅ Handle Profile Menu Open/Close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/mentorship/login");
  };

  const services = [
    { name: "Networking", image: "../../networking.jpg", description: "Build connections with professionals and peers." },
    { name: "Resume Building", image: "../resume-build.jpg", description: "Learn how to craft an impactful resume." },
    { name: "Interview Skills", image: "../interview-skills.webp", description: "Improve your interviewing techniques and confidence." },
    { name: "Career Guidance", image: "../career-guidance.png", description: "Get expert advice on career paths and growth." },
    { name: "Leadership", image: "../leadership-skills.png", description: "Develop strong leadership and decision-making skills." },
    { name: "Public Speaking", image: "../public-speaking.png", description: "Enhance your communication and presentation skills." },
    { name: "Time Management", image: "../time.jpeg", description: "Master strategies to manage your time efficiently." },
    { name: "Team Collaboration", image: "../team.jpeg", description: "Work effectively in teams and group projects." },
    { name: "Personal Branding", image: "../brand.jpeg", description: "Learn how to market yourself professionally." },
    { name: "Entrepreneurship", image: "../entrepreneurship.jpeg", description: "Understand business models and startup essentials." },
    { name: "Networking Strategies", image: "../network.jpeg", description: "Develop networking techniques to grow professionally." },
    { name: "Conflict Resolution", image: "../conflict.jpeg", description: "Manage workplace and personal conflicts effectively." },
    { name: "Critical Thinking", image: "../critical.jpg", description: "Sharpen your analytical and problem-solving skills." },
    { name: "Emotional Intelligence", image: "../emo.png", description: "Improve self-awareness and relationship management." },
    { name: "Work-Life Balance", image: "../work.jpg", description: "Learn how to maintain a healthy work-life balance." },
  ];

  // ✅ Handle mouse hover events
  const handleMouseEnter = (event, service) => {
    const rect = event.target.getBoundingClientRect();
    setPosition({ x: rect.left + window.scrollX + 50, y: rect.top + window.scrollY - 10 });
    setHoveredService(service);
  };

  const handleMouseLeave = () => {
    setHoveredService(null);
  };

  return (
    <>
      <Navbar/>
      {/* ✅ Navigation Bar with Account Dropdown */}
      <AppBar position="static" style={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Mentorship Dashboard
          </Typography>

          {/* ✅ User Account Dropdown */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{sessionStorage.getItem("name")}</Typography>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar src={sessionStorage.getItem("picture")} alt={sessionStorage.getItem("name")} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> View Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" style={{ marginTop: "40px" }}>
        {/* Summary Section */}
        <Box style={{ marginBottom: "40px", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Mentorship Program
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Total Members: {totalUsers} | Mentors: {mentorCount} | Mentees: {menteeCount}
          </Typography>
        </Box>

        {/* Call-to-Action Button */}
        <Box style={{ textAlign: "center", marginBottom: "40px" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/mentorship/register"
            style={{ background: "linear-gradient(90deg, #1a237e, #283593)" }}
          >
            Join the Program
          </Button>
        </Box>

        {/* Services Section */}
        <Typography variant="h5" gutterBottom>
          Services Offered in the Program
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: "20px",pb:10, filter: hoveredService ? "blur(1px)" : "none" }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}  >
              <Card
                elevation={3}
                sx={{ borderRadius: "10px", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={(e) => handleMouseEnter(e, service)}
                onMouseLeave={handleMouseLeave}
              >
                <CardMedia component="img" height="140" image={service.image} alt={service.name} />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Floating Description Box */}
        {hoveredService && (
          <Box
            sx={{
              position: "absolute",
              top: position.y,
              left: position.x,
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              borderRadius: "8px",
              p: 2,
              minWidth: 200,
              zIndex: 10,
              transition: "opacity 0.3s",
            }}
          >
            <Typography variant="body1" fontWeight="bold">{hoveredService.name}</Typography>
            <Typography variant="body2">{hoveredService.description}</Typography>
          </Box>
        )}
      </Container>
    </>
  );
}

export default MentorshipDashboard;
