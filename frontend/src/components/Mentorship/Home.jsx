import Navbar from "../NavBar";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { Link,Outlet,useLocation } from "react-router-dom";

const MentorshipHome = () => {

  const location = useLocation();
  const isParentRoute = location.pathname === "/mentorship";

  return (
    <>
      <Navbar/>
      { isParentRoute && (
      <Container sx={{ marginTop: "40px" }}>
        <Box textAlign="center" marginBottom={3}>
          <Typography variant="h3" gutterBottom>
            Alumni Mentor Program
          </Typography><br></br>
          <Typography variant="body1" sx={{ maxWidth: "800px", margin: "10px auto" }}>
            The mentorship program aims to bridge the gap between alumni and students by creating a
            supportive and collaborative environment. Alumni can share their invaluable experiences,
            while students can seek guidance to shape their future careers.
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "800px", margin: "10px auto" }}>
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

        <Grid container justifyContent="center" sx={{pb:8}}>
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
    <Outlet />
    </>
  );
};

export default MentorshipHome;
