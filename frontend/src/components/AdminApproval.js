import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, CardContent, CardActions, Typography, Button, Container, 
  Alert, Stack, Box, TextField 
} from "@mui/material";
import AdminNavBar from "./AdminNavBar";

// demo change
// demo change 2

const AdminApproval = () => {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams, setSearchParams] = useState({ 
    name: "", 
    rollNumber: "", // ✅ Added rollNumber field  
    graduationYear: "", 
    programStudied: "" 
  });

  useEffect(() => {
    fetchPendingAlumni(); // Fetch all alumni initially
  }, []);

  const fetchPendingAlumni = async (params = {}) => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/pending-alumni", { params });
      setPendingAlumni(response.data);
    } catch (error) {
      setError("Failed to fetch alumni.");
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchPendingAlumni(searchParams); // Fetch filtered results
  };

  const handleClear = () => {
    setSearchParams({ name: "", rollNumber: "", graduationYear: "", programStudied: "" });
    fetchPendingAlumni(); // Refresh and show all pending alumni
  };

  const handleApproval = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-alumni/${id}`, { status });
      setSuccess(`Alumni ${status} successfully.`);
      setTimeout(() => setSuccess(""), 3000);
      setPendingAlumni((prev) => prev.filter((alumni) => alumni._id !== id));
    } catch (error) {
      setError("Failed to update approval status.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Gradient Header */}
      <><AdminNavBar /></>
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
          Alumni Approval
        </Typography>
      </Box>

      {/* Search Inputs */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField 
          label="Search by Name" 
          name="name" 
          variant="outlined" 
          fullWidth 
          value={searchParams.name} 
          onChange={handleInputChange} 
        />
        <TextField 
          label="Roll Number"  // ✅ New search field  
          name="rollNumber" 
          variant="outlined" 
          fullWidth 
          value={searchParams.rollNumber} 
          onChange={handleInputChange} 
        />
        <TextField 
          label="Graduation Year" 
          name="graduationYear" 
          variant="outlined" 
          fullWidth 
          value={searchParams.graduationYear} 
          onChange={handleInputChange} 
        />
        <TextField 
          label="Program Studied" 
          name="programStudied" 
          variant="outlined" 
          fullWidth 
          value={searchParams.programStudied} 
          onChange={handleInputChange} 
        />
      </Box>

      {/* Search & Clear Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      {/* Error & Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Alumni List */}
      {pendingAlumni.length === 0 ? (
       <Box sx={{ mb: 6 }}>
  <Typography textAlign="center" color="textSecondary">
    No pending alumni registrations found.
  </Typography>
</Box>
      ) : (
        <Stack spacing={3}>
          {pendingAlumni.map((alumni) => (
            <Card key={alumni._id} elevation={4} sx={{ borderRadius: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {alumni.name}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                  <strong>Roll No:</strong> {alumni.rollNumber}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                  <strong>Email:</strong> {alumni.email}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                  <strong>Graduation Year:</strong> {alumni.yearOfGraduation}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                  <strong>Program Studied:</strong> {alumni.programStudied}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                  <strong>LinkedIn URL:</strong> {alumni.linkedinUrl}
                </Typography>
              </CardContent>

              <CardActions>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproval(alumni._id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleApproval(alumni._id, "rejected")}
                  >
                    Reject
                  </Button>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default AdminApproval;
