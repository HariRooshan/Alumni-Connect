
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Link, CircularProgress, Paper } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import axios from "axios";

const ContactUs = () => {
  const [contact, setContact] = useState({ email: "", phone: "", alternateEmail: "", mobile: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/getcontact")
      .then((response) => {
        setContact(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contact info:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('Alumni_Image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
       <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CONTACT US
      </Typography>

      <Box display="flex" justifyContent="center" gap={4} mb={4}>
        <EmailIcon sx={{ fontSize: 60, color: "blue" }} />
        <PhoneIcon sx={{ fontSize: 60, color: "blue" }} />
        <SmartphoneIcon sx={{ fontSize: 60, color: "blue" }} />
        <AlternateEmailIcon sx={{ fontSize: 60, color: "blue" }} />
      </Box>

      {/* Contact Info Box */}
     
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          CONTACT ALUMNI OFFICE
        </Typography>

        <Typography variant="body1" mt={1}>
          <strong>Email:</strong>{" "}
          <Link href={`mailto:${contact.email}`} underline="hover" color="blue">
            {contact.email || "Not Available"}
          </Link>
        </Typography>

        {contact.alternateEmail && (
          <Typography variant="body1" mt={1}>
            <strong>Alternate Email:</strong>{" "}
            <Link href={`mailto:${contact.alternateEmail}`} underline="hover" color="blue">
              {contact.alternateEmail}
            </Link>
          </Typography>
        )}

        <Typography variant="body1" mt={1}>
          <strong>Phone:</strong> {contact.phone || "Not Available"}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ContactUs;