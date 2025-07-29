import React,{useState} from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Paper } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../NavBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


function MentorshipGuidelines() {
  // const location = useLocation();
  // const isParentRoute = location.pathname === "/mentorship-home"; // Check if on the parent `/mentorship` route
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if(!token){
    console.log("g=ehldhjcn");
  }
  const decodedToken = jwtDecode(token);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // Decode safely
  let EMAIL_ID = decodedToken.email; // Extract email
  console.log("User Email:", EMAIL_ID);
  let userRole = decodedToken.role;
  // const fetchMemberCount = async () => {
  //   try{
  //     const response = await fetch("http://localhost:5000/api/users/getUserByEmail");
  //     if(response.status === 404){
  //       console.log("Error 404 : No data found");
  //     }
  //     const result = await response.json();
  //     setMentorCount();
  //     setMenteeCount(result.menteeCount);
  //     setTotalUsers(result.totalUsers);
  //   } catch (error) {
  //     console.error("Error fetching user counts:", error);
  //   }
  // }
  const check_user = async () => {
  try {
    if (!EMAIL_ID) {
      console.error("EMAIL_ID is undefined.");
      return;
    }
    console.log("Inside:",EMAIL_ID);
    const response = await fetch("http://localhost:5000/api/auth/check-user2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: EMAIL_ID }),
    });
    console.log(response);
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
        navigate("/mentorship/dashboard");
      }, 1500);
    }
  } catch (error) {
    console.error("Error checking user:", error);
    setAlert(true);
    setAlertType("error");
    setAlertMessage("Something went wrong. Please try again.");
  }
};

  return (
    <>
      {/* Navigation Bar */}
      {/* <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
        <Toolbar>
          <img 
            src={Logo} 
            alt="Logo" 
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Alumni-Student Portal
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/mentorship/login">Login</Button>
          <Button color="inherit" component={Link} to="/mentorship">Mentorship</Button>
        </Toolbar>
      </AppBar> */}

      <Navbar/>

      {/* Main Content */}
      {(
        <Container maxWidth="lg" style={{ marginTop: "30px" }}>
          {/* Title */}
          <Typography variant="h4" align="center" gutterBottom>
            Mentorship Program
          </Typography>

          {/* Guidelines Section */}
          <Grid container spacing={4} style={{ marginTop: "20px" }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h5" gutterBottom>
                  <b>Guidelines for Mentors</b>
                </Typography>
                <Typography variant="body1">
                  - Share your expertise and guide students.<br />
                  - Provide career advice and industry insights.<br />
                  - Help mentees with skill development.<br />
                  - Foster meaningful connections.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h5" gutterBottom>
                  <b>Guidelines for Mentees</b>
                </Typography>
                <Typography variant="body1">
                  - Seek guidance from experienced mentors.<br />
                  - Be proactive in asking questions.<br />
                  - Set clear goals for mentorship.<br />
                  - Respect your mentor's time and effort.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Features Section */}
          <Box style={{ marginTop: "30px", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Why Join the Mentorship Program?
            </Typography>
            <Typography variant="body1" style={{ marginTop: "10px", maxWidth: "800px", margin: "0 auto" }}>
              - Build strong connections with alumni.<br />
              - Gain insights into career paths and industries.<br />
              - Improve your skills and confidence.<br />
              - Be part of a thriving community.
            </Typography>
          </Box>

          {/* Call-to-Action Button */}
          <Box sx={{ marginTop: "40px", textAlign: "center", pb: 5 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={check_user}
            style={{ background: "linear-gradient(90deg, #1a237e, #283593)" }}
          >
            Join the Program
          </Button>
        </Box>
        </Container>
      )}

      {/* Render child components */}
      <Outlet />
    </>
  );
}

export default MentorshipGuidelines;
