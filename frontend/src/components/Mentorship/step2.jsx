import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Box,
} from "@mui/material";

const Step2 = ({ onNext, onBack, formData, setFormData }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [preview, setPreview] = useState(formData.profilePic || user?.picture || ""); // Profile pic preview

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleFileUpload = (e) => { 
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Show preview
        setFormData({ ...formData, profilePic: reader.result }); // Store as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please fill in both First Name and Last Name before proceeding.");
      return; // Prevent navigation if fields are empty
    }
    onNext(); // Only proceed if validation passes
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 5 }}>
        <Typography variant="h5" gutterBottom>
          Step 2: Profile Information
        </Typography>

        {/* ✅ Profile Picture Upload */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar src={sessionStorage.getItem("picture")} alt="Profile" sx={{ width: 80, height: 80 }} />
          {/* <Button variant="contained" component="label">
            Change Profile Picture
            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
          </Button> */}
        </Box>

        {/* ✅ Editable First Name */}
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          variant="outlined"
          value={formData.firstName || user?.given_name || ""}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        {/* ✅ Editable Last Name */}
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={formData.lastName || user?.family_name || ""}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        {/* ✅ Introduction */}
        <TextField
          fullWidth
          label="Introduce Yourself"
          name="introduction"
          variant="outlined"
          multiline
          rows={3}
          value={formData.introduction}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* ✅ LinkedIn URL */}
        <TextField
          fullWidth
          label="LinkedIn Profile URL"
          name="linkedin"
          variant="outlined"
          value={formData.linkedin}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* ✅ Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={() => onNext(formData)}>
            Proceed
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step2;
