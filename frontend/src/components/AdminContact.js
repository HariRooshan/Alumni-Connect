import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, CardContent, CardActions, Typography, Button, Container, 
  Alert, Stack, Box, TextField 
} from "@mui/material";
import AdminNavBar from "./AdminNavBar";

// demo change 2
const AdminContact = () => {
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
    address: "",
    privacyPolicyUrl: "",
    termsOfUseUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/getcontact");
      setContactDetails(response.data);
    } catch (error) {
      setError("Failed to fetch contact details.");
    }
  };

  const handleInputChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/admin/updatecontact", contactDetails);
      setSuccess("Contact details updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update contact details.");
    }
  };

  return (
    
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <><AdminNavBar /></>
      {/* Gradient Header */}
      <Box
        sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="white">
          Contact Updation
        </Typography>
      </Box>

      {/* Error & Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Contact Form */}
      <Card elevation={4} sx={{ borderRadius: 2, p: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField 
              label="Admin Email" 
              name="email" 
              variant="outlined" 
              fullWidth 
              value={contactDetails.email} 
              onChange={handleInputChange} 
            />
            <TextField 
              label="Phone Number" 
              name="phone" 
              variant="outlined" 
              fullWidth 
              value={contactDetails.phone} 
              onChange={handleInputChange} 
            />
            
          </Stack>
        </CardContent>

        {/* Update Button */}
        <CardActions>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdate}
              sx={{ padding: "10px 20px", fontWeight: "bold" }}
            >
              Update Contact Details
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Container>
  );
};

export default AdminContact;
