import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Paper } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function MentorshipGuidelines() {
  // const location = useLocation();
  // const isParentRoute = location.pathname === "/mentorship-home"; // Check if on the parent `/mentorship` route

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
          <Box sx={{ marginTop: "40px", textAlign: "center",pb:5 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/mentorship/login" 
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
