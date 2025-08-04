import { 
  Typography, Radio, RadioGroup, FormControlLabel, 
  Button, Paper, Box 
} from "@mui/material";

const Step1 = ({ onNext, formData, setFormData }) => {
  const handleProceed = () => {
    if (formData.role) {
      onNext({ role: formData.role });
    }
  };

  return (
    <Box sx={{ width: "60%", justifyContent: "center" , margin:"auto" }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 5, 
          textAlign: "center", 
          marginTop: 5,
          marginBottom: 5,
          width: "85%",
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
          value={formData.role || ""} 
          onChange={(e) => {
            setFormData({ ...formData, role: e.target.value });
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
          <Button variant="contained" color="primary" onClick={handleProceed} disabled={!formData.role}>
            Proceed
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Step1;