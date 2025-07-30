import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Box, Typography, TextField, Button, Alert } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSuccess("Password reset link sent to your email.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/Alumni_Image.jpg')", // Update path if needed
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 450,
            backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent white
            backdropFilter: "blur(10px)", // Smooth blending effect
          }}
        >
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
            Forgot Password
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleForgotPassword} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                "&:hover": { background: "linear-gradient(to right, #3a00c0, #7a2bcf)" },
              }}
            >
              Send Reset Link
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
