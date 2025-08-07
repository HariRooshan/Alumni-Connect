
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar";

function MentorshipDashboard() {
  const navigate = useNavigate();
  const [mentorCount, setMentorCount] = useState(0);
  const [menteeCount, setMenteeCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // Decode safely
  const [isRegistered, setIsRegistered] = useState(null); // null = unknown, true/false = checked

  useEffect(() => {
    fetchMemberCount ()
  }, []);
  

  useEffect(() => {
    const checkRegistration = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsRegistered(false);
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        const EMAIL_ID = decodedToken.email;
        if (!EMAIL_ID) {
          setIsRegistered(false);
          return;
        }
        const response = await fetch("http://localhost:5000/api/auth/check-user2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: EMAIL_ID }),
        });
        setIsRegistered(response.status < 400);
      } catch (error) {
        setIsRegistered(false);
      }
    };
    checkRegistration();
  }, []);

  const fetchMemberCount = async () => {
    try{
      const response = await fetch("http://localhost:5000/api/users/count");
      if(response.status === 404){
        console.log("Error 404 : No data found");
      }
      const result = await response.json();
      setMentorCount(result.mentorCount);
      setMenteeCount(result.menteeCount);
      setTotalUsers(result.totalUsers);
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }
  }

  const check_user = async () => {
    const token = localStorage.getItem("token");
    if(!token){
      console.log("g=ehldhjcn");
    }
    const decodedToken = jwtDecode(token);
    let EMAIL_ID = decodedToken.email; // Extract email
    try {
      if (!EMAIL_ID) {
        console.error("EMAIL_ID is undefined.");
        return;
      }
      const response = await fetch("http://localhost:5000/api/auth/check-user2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: EMAIL_ID }),
      });
      if (response.status < 400) {

        const data = await response.json();

        const user = data.user;
        const fullName = user.firstName + " " + user.lastName;
        const isAdminOrMentor = user.role !== "user";

        const userSession = {
          name: isAdminOrMentor ? fullName : user.name,
          email: user.email,
          picture: isAdminOrMentor ? user.photo : user.picture,
          role: user.role || "user",
          id: user._id,
        };

        // ✅ Store session
        sessionStorage.setItem("user", JSON.stringify(userSession));
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("name", userSession.name);
        sessionStorage.setItem("picture", userSession.picture);
        sessionStorage.setItem("role", user.role || "user");
        sessionStorage.setItem("id", user._id);

        // ✅ Set alerts
        setAlert(true);
        setAlertType("success");
        setAlertMessage(`Login successful: Welcome ${userSession.name}`);

        setTimeout(() => {
          navigate("/mentorship/main");
        }, 1500);
      } else {
        // ❌ User not found in DB
        setTimeout(() => {
          navigate("/mentorship/register");
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setAlert(true);
      setAlertType("error");
      setAlertMessage("Something went wrong. Please try again.");
    }
  }

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
            onClick={check_user}
            style={{ background: "linear-gradient(90deg, #1a237e, #283593)" }}
          >
            {isRegistered === null
              ? "Loading..."
              : isRegistered
                ? "Go to Mentorship Portal"
                : "Register for the Mentorship Program"}
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
      {/* 🔹 Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={ { vertical: "top", horizontal: "right" } }
        open={alert}
        autoHideDuration={3000}
        // size="large"
        onClose={() => setAlert(false)}>
        <Alert size="large" severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MentorshipDashboard;
