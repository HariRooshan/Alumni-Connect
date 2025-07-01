import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
import { Link,Outlet,useLocation } from "react-router-dom";
import Logo from "../../images/psg-alumni-logo.png"; // Replace with your logo path

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif", // Global font for the entire app
    h3: {
      fontFamily: "Raleway, sans-serif",
      fontWeight: 500, // Makes it bold
    },
    body1: {
      fontFamily: "Roboto, sans-serif",
      fontSize: "16px",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "Poppins, sans-serif",
      textTransform: "none", // Prevents uppercase transformation
    },
  },
});

const MentorshipHome = () => {

  const location = useLocation();
  const isParentRoute = location.pathname === "/mentorship";

  console.log(isParentRoute);
    // const navigate = useNavigate();
  return (
    <>
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
        <Toolbar>
          { <img 
            src={Logo} 
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          /> }
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Alumni-Student Portal
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/mentorship/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/mentorship">
            Mentorship
          </Button>
        </Toolbar>
      </AppBar>

      { isParentRoute && (
      <Container sx={{ marginTop: "50px" }}>
        <Box textAlign="center" marginBottom={4}>
          <Typography variant="h3" gutterBottom>
            Alumni Mentor Program
          </Typography><br></br>
          <Typography variant="body1" sx={{ maxWidth: "800px", margin: "20px auto" }}>
            The mentorship program aims to bridge the gap between alumni and students by creating a
            supportive and collaborative environment. Alumni can share their invaluable experiences,
            while students can seek guidance to shape their future careers.
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "800px", margin: "20px auto" }}>
          The new Alumni Mentor Program is a wonderful way for alumni to share their talents and 
          skills with one another, and to more deeply engage the broader network of PSG TECH alums.

            The Mentor Program is entirely peer-driven. Mentees will indicate their interest by 
            messaging potential mentors through the Alumni Mentor Connect platform. Mentors have 
            the ability to approve or reject requests as they choose. Together, mentors and mentees
             will decide the scope, length, and goals of their relationship. This allows for 
             relationships to be flexible and evolve according to each pair's needs.
          </Typography>
          <br></br>
        </Box>

        <Grid container justifyContent="center" sx={{pb:10}}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            text-weight = "bold"
            sx  ={{ borderRadius: "20px", padding: "10px 30px" }}
            LinkComponent={Link} to="/mentorship/guidelines"
          >
            Become a Mentor / Find a Mentor
          </Button>
        </Grid>
      </Container>
      )}
      
    </ThemeProvider>
    <Outlet />
    </>
  );
};

export default MentorshipHome;
