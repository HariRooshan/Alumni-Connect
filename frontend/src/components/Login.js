import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Paper, Box, Typography, TextField, Button, Alert, Link } from "@mui/material";
import { Snackbar } from "@mui/material";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false); // ✅ Snackbar state
  const [message, setMessage] = useState(""); // Stores success or error message
  const [severity, setSeverity] = useState("error"); // Controls Snackbar type

  

  // Display message if redirected from a protected page
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      //setError(location.state.message);
      setOpenSnackbar(true);
    }
  }, [location]);

   // ✅ Define the function before rendering JSX
   const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSeverity("error"); // Default to error severity
    setOpenSnackbar(false); // Close any previous snackbar

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (response.data.token) {
          setMessage("Login successful! Redirecting...");
          setSeverity("success");
          setOpenSnackbar(true);
          localStorage.setItem("token", response.data.token);

          // Check if redirectTo exists in the response
          const redirectTo = response.data.redirectTo || "/";  // Default to home if not specified

          setTimeout(() => {
              navigate(redirectTo);
          }, 2000);
      }
  } catch (error) {
      if (error.response) {
          const { message, redirectTo } = error.response.data;

          setMessage(message || "An unexpected error occurred. Please try again.");
          setSeverity("error");
          setOpenSnackbar(true);

          // If there is a redirect instruction (e.g., alumni registration), navigate after showing message
          if (redirectTo) {
              setTimeout(() => {
                  navigate(redirectTo);
              }, 3000);
          }
      } else {
          setMessage("Server error. Please try again.");
          setSeverity("error");
          setOpenSnackbar(true);
      }
  }
};

  return (
    <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Full-screen Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('Alumni_Image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1, // Ensures the background stays behind content
        }}
      />

      {/* Snackbar (Popup Alert) */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000} // Disappears after 4 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>


      {/* Login Form Container */}
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, textAlign: "center", width: "100%", maxWidth: 450 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(to right, #4a00e0, #8e2de2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            gutterBottom
          >
            Welcome Back!
          </Typography>
          <Typography variant="body1" color="textSecondary" marginBottom={2}>
            Please log in to your account
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                color: "#fff",
                "&:hover": { background: "linear-gradient(to right, #3a00c0, #7a2bcf)" },
              }}
              size="large"
            >
              Log In
            </Button>
          </Box>

          <Box mt={2}>
            <Link href="#" onClick={() => navigate("/choosesignup")} color="primary" underline="hover">
              Don't have an account? Sign Up
            </Link>
            <br />
            <Link href="#" onClick={() => navigate("/forgot-password")} color="primary" underline="hover">
              Forgot Password?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
