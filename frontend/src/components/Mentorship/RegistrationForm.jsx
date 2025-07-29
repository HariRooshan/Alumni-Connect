import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Navbar from "../NavBar";

const RegistrationForm = () => {
  const token = localStorage.getItem("token");
    if(!token){
      navigate("/login");
    }
    const decodedToken = jwtDecode(token);
     // Decode safely
    let EMAIL_ID = decodedToken.email; // Extract email
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email:EMAIL_ID,
    role: "",
    firstName: "",
    lastName: "",
    introduction: "",
    linkedin: "",
    skills: [],
    experienceOrYear: "",
    industryOrDepartment: "",
    meetingMethod: "",
    education: "",
    photo:sessionStorage.getItem("picture"),
  });
  console.log(sessionStorage);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch user data from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));

  const nextStep = async(data) => {
    // Merge new data into formData
    // console.log(data.role['role']);
    if(step===1)
    {
      formData.role = data.role['role'];
    }
    formData.email = EMAIL_ID;
    const updatedFormData = { ...formData};
    // console.log(formData);

    // Step 2 Validation: First Name & Last Name Required
    if (step === 2) {
      if (!updatedFormData.firstName?.trim() || !updatedFormData.lastName?.trim()) {
        setSnackbarMessage("Please fill in both First Name and Last Name before proceeding.");
        setSnackbarOpen(true); // Show Snackbar
        return; // Stop function execution
      }
    }

    if(step===4)
    {
      if (!updatedFormData.experienceOrYear || !updatedFormData.industryOrDepartment || !updatedFormData.meetingMethod) {
        setSnackbarMessage("Please fill in both Experience/Year and Industry/Department before proceeding.");
        setSnackbarOpen(true); // Show Snackbar
        return; // Stop function execution
      }

      else
      {
        console.log(updatedFormData);
        fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setSnackbarMessage(data.error);
              setSnackbarOpen(true);
            } else {
              setTimeout(() => {
                navigate("/mentorship/main");
              },1500);
            }
          })
          .catch((error) => {
            console.error("Error registering user:", error);
            setSnackbarMessage("An error occurred while registering. Please try again.");
            setSnackbarOpen(true);
          });
        const response = await fetch("http://localhost:5000/api/auth/check-user2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: EMAIL_ID }),
      });
      console.log(response);
      if (response.status < 400) {

        const data = await response.json();

        const user = data.user;
        const fullName = user.firstName + " " + user.lastName;
        const isAdminOrMentor = user.role !== "user";

        const userSession = {
          name: isAdminOrMentor ? fullName : user.name,
          email: user.email,
          picture: isAdminOrMentor ? user.photo : user.picture,
          role: user.role || "user",
          id: user._id,
        };

        // ✅ Store session
        sessionStorage.setItem("user", JSON.stringify(userSession));
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("name", userSession.name);
        sessionStorage.setItem("picture", userSession.picture);
        sessionStorage.setItem("role", user.role || "user");
        sessionStorage.setItem("id", user._id);
            
      }
      }
    }

    // ✅ If validation passes, update formData and move to the next step
    setFormData(updatedFormData);
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // Handle Profile Menu Open/Close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Navbar/>
      {/* ✅ Navigation Bar (Visible on All Steps) */}
      <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mentorship Registration
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{sessionStorage.getItem("name")}</Typography>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar src={sessionStorage.getItem("picture")} alt={sessionStorage.getItem("name")} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 1 }}>
                <MenuItem onClick={() => navigate("/profile")}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> View Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ Render Steps */}
      {step === 1 && <Step1 onNext={(role) => nextStep({ role })} />}
      {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3 onNext={nextStep} onBack={prevStep} formData={formData} setFormData={setFormData} />}
      {step === 4 && <Step4 onBack={prevStep} formData={formData} setFormData={setFormData} onNext={nextStep} />}

      {/* ✅ Snackbar for Validation Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegistrationForm;
