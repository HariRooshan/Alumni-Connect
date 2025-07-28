import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Paper, Typography, Box, MenuItem, Alert, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AlumniRegistration = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    rollNumber: "",
    yearOfGraduation: "",
    programStudied: "",
    linkedinUrl: "",
    job: "",
    sector: "Public",
    higherStudies: "No",
    institutionName: "",
    degreePursued: "",
    specialization: "",
    yearOfCompletion: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "higherStudies" && value === "No") {
      setFormData((prev) => ({
        ...prev,
        institutionName: "",
        degreePursued: "",
        specialization: "",
        yearOfCompletion: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/alumni/register-alumni", formData);
      setSuccess("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      setFormData({
        email: "",
        name: "",
        rollNumber: "",
        yearOfGraduation: "",
        programStudied: "",
        linkedinUrl: "",
        job: "",
        sector: "Public",
        higherStudies: "No",
        institutionName: "",
        degreePursued: "",
        specialization: "",
        yearOfCompletion: "",
      });
    } catch (error) {
      setError(error.response?.data || "Something went wrong.");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('Alumni_Image.jpg')",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 8,
          borderRadius: 4,
          width: "80%",
          maxWidth: 1200,
          boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.8)",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            textAlign: "center",
            background: "linear-gradient(to right, #4a00e0, #8e2de2)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 6,
          }}
        >
          Alumni Registration
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, fontSize: "1.1rem" }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, fontSize: "1.1rem" }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
              <TextField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
              <TextField label="Roll Number" type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} fullWidth sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Year of Graduation" type="number" name="yearOfGraduation" value={formData.yearOfGraduation} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
              <TextField label="Program Studied" type="text" name="programStudied" value={formData.programStudied} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
              <TextField label="LinkedIn URL" type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Job Title" type="text" name="job" value={formData.job} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
              <TextField select label="Sector" name="sector" value={formData.sector} onChange={handleChange} fullWidth required sx={{ mb: 3 }}>
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </TextField>
              <TextField select label="Higher Studies" name="higherStudies" value={formData.higherStudies} onChange={handleChange} fullWidth required sx={{ mb: 3 }}>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {formData.higherStudies === "Yes" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField label="Institution Name" type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Degree Pursued" type="text" name="degreePursued" value={formData.degreePursued} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Specialization" type="text" name="specialization" value={formData.specialization} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Year of Completion" type="number" name="yearOfCompletion" value={formData.yearOfCompletion} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
                </Grid>
              </>
            )}

            <Grid item xs={12} sx={{ textAlign: "center", mt: 5 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                  padding: "16px 44px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  transition: "0.3s",
                  borderRadius: "12px",
                  ":hover": { transform: "scale(1.08)", boxShadow: "0px 6px 24px rgba(78, 52, 255, 0.6)" },
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AlumniRegistration;
