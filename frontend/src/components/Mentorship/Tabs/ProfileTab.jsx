import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, CircularProgress, Paper, Chip, Avatar, Dialog, DialogTitle,
  DialogContent, Stepper, Step, StepLabel, Stack, IconButton, Snackbar, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Step1 from "../step1";
import Step2 from "../step2";
import Step3 from "../step3";
import Step4 from "../step4";

const steps = ["Basic Info", "Education", "Skills", "Summary"];

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  // Get user ID from session storage
  const userId = sessionStorage.getItem("id");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        console.log("fetch res = ",res);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleEditOpen = () => {
    setFormData(profile); // Ensure formData is prefilled with profile details
    setEditData(profile);  // Pre-fill with profile data
    setActiveStep(0);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/update/${userId}` , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("save Response:", res);
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setSnackbarOpen(true);
        setTimeout(() => {
          setEditOpen(false);
        }, 1000)
      }
    } catch (err) {
      // Optionally show error
    } finally {
      setSaving(false);
    }
  };

  // Example function in your ProfileTab.jsx
  const handleLeaveProgram = async () => {
    if (window.confirm("Are you sure you want to leave the mentorship program? This action cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/leave-program/${userId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          // Optionally clear session and redirect
          sessionStorage.clear();
          navigate("/mentorship"); // or your landing page
        }
      } catch (err) {
        // Show error snackbar
      }
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 formData={formData} setFormData={setFormData} onNext={handleNext} isEdit />;
      case 1:
        return <Step2 formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} isEdit />;
      case 2:
        return <Step3 formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} isEdit />;
      case 3:
        return <Step4 formData={formData} setFormData={setFormData} onBack={handleBack} onNext={handleSave} isEdit saving={saving} />;
      default:
        return null;
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (!profile) return <Typography color="error">Unable to load profile.</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4, mb: 6,  borderRadius: 4, boxShadow: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar src={profile.photo} sx={{ width: 72, height: 72, mr: 3, bgcolor: "primary.main" }}>
          {profile.firstName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={600}>{profile.firstName} {profile.lastName}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{profile.role}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="primary" onClick={handleEditOpen} aria-label="edit profile">
          <EditIcon />
        </IconButton>
      </Box>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography><b>Email:</b> {profile.email}</Typography>
        <Typography><b>Introduction:</b> {profile.introduction || <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>LinkedIn:</b> {profile.linkedin ? (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a>
        ) : <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>Experience/Year:</b> {profile.experienceOrYear || <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>Industry/Department:</b> {profile.industryOrDepartment || <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>Meeting Method:</b> {profile.meetingMethod || <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>Education:</b> {profile.education || <span style={{color:"#888"}}>Not set</span>}</Typography>
        <Typography><b>Skills:</b></Typography>
        <Box sx={{ mb: 1 }}>
          {profile.skills && profile.skills.length > 0
            ? profile.skills.map((skill) => (
                <Chip key={skill} label={skill} sx={{ mr: 1, mb: 1 }} />
              ))
            : <span style={{color:"#888"}}>No skills listed</span>
          }
        </Box>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button 
          variant="contained" 
          color="error" 
          sx={{borderRadius: 3 }}
          onClick={handleLeaveProgram }
        >
          Leave Mentorship Program
        </Button>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth={false}
        PaperProps={{
          sx: { width: 900, maxWidth: "95vw" }
        }}
      >
        <DialogTitle>
          Edit Profile
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2, pt: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </DialogContent>
        {/* If your step components already have navigation buttons, you can omit DialogActions here */}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileTab;