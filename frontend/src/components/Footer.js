import { useEffect, useState } from "react";
import { Box, Typography, Link, Container, Grid } from "@mui/material";
import axios from "axios";

const Footer = () => {
  const [contact, setContact] = useState({ email: "", phone: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/getcontact")
      .then(response => setContact(response.data))
      .catch(error => console.error("Error fetching contact info:", error));
  }, []);

  return (
    <Box 
      component="footer" 
      sx={{ 
        color: "white", 
        py: 1.5, 
        background: "linear-gradient(to right, #4a00e0, #8e2de2)" 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md="auto">
            <Typography variant="body1" fontWeight="bold">Contact</Typography>
            <Typography variant="body2">
              <Link href={`mailto:${contact.email}`} color="inherit" underline="hover">
                {contact.email || "Loading..."}
              </Link>
            </Typography>
            <Typography variant="body2">{contact.phone || "Loading..."}</Typography>
          </Grid>

          <Grid item xs={12} md="auto">
            <Typography variant="body1" fontWeight="bold">
              <Link href="/privacy-policy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="/terms-of-use" color="inherit" underline="hover">
                Terms of Use
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
