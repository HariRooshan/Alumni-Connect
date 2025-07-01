import React, { useState } from "react";
import { 
  Container, Typography, Radio, RadioGroup, FormControlLabel, 
  Button, Paper, Box 
} from "@mui/material";

const RegistrationForm = ({ onNext }) => {
  const [role, setRole] = useState("");

  const handleProceed = () => {
    if (role) {
      onNext({ role }); // Pass selected role to next step
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 7, 
          textAlign: "center", 
          marginTop: 10,
          width: "90%",
          border: "2px solidrgb(16, 115, 214)", // Blue border
          borderRadius: 4 // Rounded corners
        }}
      >
        <Typography variant="h4" gutterBottom>
          Step 1: Choose Your Role
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Are you registering as a Mentor or a Mentee?
        </Typography>

        <RadioGroup 
          value={role} 
          onChange={(e) => {
            setRole(e.target.value);
            sessionStorage.setItem("role", e.target.value); // Store role in session storage
          }} 
          row 
          sx={{ justifyContent: "center", marginTop: 2 }}
        >
          <FormControlLabel value="mentor" control={<Radio />} label="Become a Mentor" />
          <FormControlLabel value="mentee" control={<Radio />} label="Find a mentor" />
        </RadioGroup>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <Button variant="outlined" disabled>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleProceed} disabled={!role}>
            Proceed
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationForm;