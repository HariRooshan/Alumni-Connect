import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  MenuItem,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    email: "",
    name: "",
    yearOfGraduation: "",
    programStudied: "",
    linkedinUrl: "",
    job: "",
    sector: "",
    approval_status: "",
    currentCompany: "",
    yearsOfExperience: "",
    companyLocation: "",
    achievements: "",
    higherStudies: "",
    institutionName: "",
    degreePursued: "",
    specialization: "",
    yearOfCompletion: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/alumni/profile", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          setFormData(response.data);
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (error) {
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/alumni/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.error || "Failed to update profile.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
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
        backgroundSize: "cover",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 6,
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
            mb: 4,
          }}
        >
          Update Alumni Profile
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} sm={4}>
                  <TextField label="Email" name="email" value={formData.email} fullWidth disabled sx={{ mb: 2 }} />
                  <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="Year of Graduation" name="yearOfGraduation" value={formData.yearOfGraduation} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                </Grid>

                {/* Middle Column */}
                <Grid item xs={12} sm={4}>
                  <TextField label="Program Studied" name="programStudied" value={formData.programStudied} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="Current Company" name="currentCompany" value={formData.currentCompany} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} sm={4}>
                  <TextField label="Company Location" name="companyLocation" value={formData.companyLocation} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField label="Achievements" name="achievements" value={formData.achievements} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                  <TextField select label="Higher Studies" name="higherStudies" value={formData.higherStudies} onChange={handleChange} fullWidth sx={{ mb: 2 }}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                </Grid>

                {/* Dynamic Higher Studies Fields */}
                {formData.higherStudies === "Yes" && (
                  <>
                    <Grid item xs={6}>
                      <TextField label="Institution Name" name="institutionName" value={formData.institutionName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Degree Pursued" name="degreePursued" value={formData.degreePursued} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Year of Completion" name="yearOfCompletion" value={formData.yearOfCompletion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    </Grid>
                  </>
                )}
              </Grid>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button type="submit" variant="contained" sx={{ padding: "12px 30px", fontSize: "1rem", fontWeight: "bold" }}>
                  Update Profile
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default UpdateProfile;
