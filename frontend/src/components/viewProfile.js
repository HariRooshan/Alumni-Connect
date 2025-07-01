import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/alumni/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setProfile(response.data);
      } catch (error) {
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayFields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Roll Number", key: "rollNumber" },
    { label: "Year of Graduation", key: "yearOfGraduation" },
    { label: "Program Studied", key: "programStudied" },
    { label: "Job Title", key: "job" },
    { label: "Sector", key: "sector" },
    { label: "LinkedIn", key: "linkedinUrl" },
    { label: "Current Company", key: "currentCompany" },
    { label: "Years of Experience", key: "yearsOfExperience" },
    { label: "Company Location", key: "companyLocation" },
    { label: "Achievements", key: "achievements" },
    { label: "Higher Studies", key: "higherStudies" },
    { label: "Institution Name", key: "institutionName" },
    { label: "Degree Pursued", key: "degreePursued" },
    { label: "Specialization", key: "specialization" },
    { label: "Year of Completion", key: "yearOfCompletion" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('Alumni_Image.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Container maxWidth="sm">
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        ) : error ? (
          <Alert severity="error" sx={{ textAlign: "center" }}>
            {error}
          </Alert>
        ) : profile ? (
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "500px",
              borderRadius: 3,
              background: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
              margin: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#1976d2" }}
            >
              Alumni Profile
            </Typography>
            <Grid container spacing={2}>
              {displayFields.map(
                (field) =>
                  profile[field.key] && (
                    <Grid item xs={12} sm={field.key === "email" || field.key === "name" ? 12 : 6} key={field.key}>
                      <TextField
                        label={field.label}
                        value={profile[field.key]}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </Paper>
        ) : null}
      </Container>
    </div>
  );
};

export default ViewProfile;
