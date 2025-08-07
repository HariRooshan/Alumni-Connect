import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Box, Typography, TextField, Button, Alert } from "@mui/material";
import Navbar from "../components/NavBar"; // Importing the Navbar

const SignupForm = ({ role, emailDomain }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const isStrongPassword = (pwd) => {
    // At least 8 chars, one uppercase, one lowercase, one digit, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (emailDomain && !email.endsWith(emailDomain)) {
      setError(`Please use a valid ${role} email (${emailDomain})`);
      return;
    }

    try {
      if (!isOtpSent) {
        await axios.post("http://localhost:5000/api/auth/signup", { name, email, password, role });
        setSuccess("OTP sent to your email.");
        setIsOtpSent(true);
      } else {
        await axios.post("http://localhost:5000/api/auth/verify", { email, otp });
        setSuccess(`${role} Signup successful`);

        setTimeout(() => {
          if (role.toLowerCase() === "alumni") {
            localStorage.setItem("userEmail", email);
            navigate("/alumniregistration");
          } else {
            navigate("/login");
          }
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Background Image & Form Container */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/Alumni_Image.jpg')", // Change path if needed
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
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
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent white
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
              {role} Sign Up
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box component="form" onSubmit={handleSignup} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {!isOtpSent ? (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
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
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Enter OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              )}
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
                {isOtpSent ? "Verify OTP" : "Sign Up"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default SignupForm;
