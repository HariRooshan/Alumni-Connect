import React,{useState} from "react";
import { Box, Typography, Button, Paper,Alert, TextField, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");


function UserLogin() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const decodedPayload = JSON.parse(
  //       atob(credentialResponse.credential.split(".")[1])
  //     );

  //     console.log(decodedPayload);
  
  //     const userEmail = decodedPayload.email;
  //     const userDomain = userEmail.split("@")[1];
  //     const targetDomain = ["gmail.com","psgtech.ac.in"]; // Change as needed

  //     const userSession = {
  //       name: decodedPayload.name,
  //       email: decodedPayload.email,
  //       picture: decodedPayload.picture,
  //       role: "user",
  //       id: decodedPayload.sub,
  //     };

  //     sessionStorage.setItem("user", JSON.stringify(userSession));
  //     sessionStorage.setItem("email", decodedPayload.email);
  //     sessionStorage.setItem("name", decodedPayload.name);
  //     sessionStorage.setItem("picture", decodedPayload.picture);
  //     sessionStorage.setItem("role", "user");
  
  //     if (targetDomain.includes(userDomain)) {
  //       // Check if the user exists in the database
  //       // const response = await fetch("http://localhost:5000/api/check-user", {
  //       //   method: "POST",
  //       //   headers: {
  //       //     "Content-Type": "application/json",
  //       //   },
  //       //   body: JSON.stringify({ email: userEmail }),
  //       // });
  
  //       // const data = await response.json();

  //       const response = await fetch(`http://localhost:5000/api/users/${decodedPayload.email}`);
  //       const userData = await response.json();

  
  //       if (userData.message !== "User not found") {
  //         // User exists → Redirect to Main page
  //         console.log("Data from db = ",userData);
  //         sessionStorage.setItem("email",userEmail);
  //         sessionStorage.setItem("user", JSON.stringify(decodedPayload));
  //         sessionStorage.setItem("role", userData.role);
  //         sessionStorage.setItem("id", userData._id);

  //         console.log("Session Storage = ",sessionStorage);

  //         setAlert(true);
  //         setAlertMessage(`Login successful: Welcome ${decodedPayload.name}`);
  //         setAlertType("success");

  //         setTimeout(() => {
  //           navigate("/mentorship/main");
  //         }, 1500);
  //       } 
        
  //       else {
  //         // New user → Proceed with regular login
          
  //         // socket.emit("join", {
  //         //   name: decodedPayload.name,
  //         //   email: decodedPayload.email,
  //         // });
  
  //         setAlert(true);
  //         setAlertMessage(`Login successful: Welcome ${decodedPayload.name}`);
  //         setAlertType("success");
  
  //         setTimeout(() => {
  //           navigate("/mentorship/dashboard");
  //         }, 1500);
  //       }
  //     } else {
  //       setAlert(true);
  //       setAlertMessage(`Access denied. Please use an email from ${targetDomain}.`);
  //       setAlertType("error");
  //     }
  //   } catch (error) {
  //     console.error("Google login failed:", error);
  //     // alert("An error occurred during Google login. Please try again.");
  //   }
  // }; 
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential; // Get JWT token
  
      // Send token to backend for verification & user check
      const response = await fetch("http://localhost:5000/api/auth/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: googleToken }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }
  
      // Store user session details
      const userSession = {
        name: data.user.firstName+" "+data.user.lastName,
        email: data.user.email,
        picture: data.user.photo,
        role: data.user.role || "user",
        id: data.user._id,
      };

      console.log(data.user);
  
      sessionStorage.setItem("user", JSON.stringify(userSession));
      sessionStorage.setItem("email", data.user.email);
      // sessionStorage.setItem("name", data.user.firstName + " " + data.user.lastName);
      // sessionStorage.setItem("picture", data.user.photo);
      sessionStorage.setItem("role", data.user.role || "user");
      sessionStorage.setItem("id", data.user._id);
  
      setAlert(true);
      if(data.user.role !== "user")
      {
        setAlertMessage(`Login successful: Welcome ${data.user.firstName+" "+data.user.lastName}`);
        sessionStorage.setItem("name", data.user.firstName + " " + data.user.lastName);
        sessionStorage.setItem("picture", data.user.photo);
      }
      else
      {
        setAlertMessage(`Login successful: Welcome ${data.user.name}`);
        sessionStorage.setItem("name", data.user.name);
        sessionStorage.setItem("picture", data.user.picture);
      }
      setAlertType("success");
  
      // Redirect based on whether the user exists in DB
      setTimeout(() => {
        if (data.userExists) {
          navigate("/mentorship/main");
        } else {
          navigate("/mentorship/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Google login failed:", error);
      setAlert(true);
      setAlertMessage(error.message);
      setAlertType("error");
    }
  };

  const handleGoogleError = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #333, #555)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 300,
          textAlign: "center",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <img
            src="/psg-alumni-logo.png" // Replace with your organization logo
            alt="Organization Logo"
            style={{ padding:"0px 70px" , width: "80px", height: "80px" }}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          PSG Tech Alumni Association
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<i className="fab fa-facebook-f"></i>}
          sx={{ marginBottom: 2, backgroundColor: "#3b5998" }}
        >
          Continue with Facebook
        </Button>
        <Box sx={{ marginBottom: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
          <Snackbar
            anchorOrigin={ { vertical: "top", horizontal: "right" } }
            open={alert}
            autoHideDuration={5000}
            size="large"
            onClose={() => setAlert(false)}>
            <Alert size="large" severity={alertType} variant="filled" x={{fontSize:"2.5rem", width: "100%" }}>
              {alertMessage}
              </Alert>

          </Snackbar>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<i className="fab fa-linkedin-in"></i>}
          sx={{ marginBottom: 2, backgroundColor: "#0077b5" }}
        >
          Continue with LinkedIn
        </Button>
        <Typography variant="body1" sx={{ marginY: 2 }}>
          Otherwise, enter your email to sign in or create an account
        </Typography>
        <TextField
          fullWidth
          placeholder="yours@example.com"
          variant="outlined"
          size="small"
          sx={{ marginBottom: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#6a11cb", color: "#fff" }}
        >
          Submit
        </Button>
        <Typography variant="body2" sx={{ marginTop: 2, color: "#999" }}>
          By signing up, you agree to our{" "}
          <a href="/terms" style={{ textDecoration: "none", color: "#007bff" }}>
            terms of service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            privacy policy
          </a>
          .
        </Typography>
      </Paper>
    </Box>
  );
}

export default UserLogin;
