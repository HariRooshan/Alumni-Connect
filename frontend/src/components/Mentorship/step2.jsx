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

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Step 2: Profile Information
        </Typography>

        {/* ✅ Profile Picture Upload */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar src={sessionStorage.getItem("picture")} alt="Profile" sx={{ width: 80, height: 80 }} />
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
