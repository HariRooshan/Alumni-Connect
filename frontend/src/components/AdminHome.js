import { useEffect, useState } from "react";
import { 
  Container, Grid, Card, CardContent, Typography, Button, 
  AppBar, Toolbar, Avatar, Snackbar, Alert 
} from "@mui/material";
import { Event, PhotoLibrary, People, ContactMail } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import for decoding token

export default function AdminHome() {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbarMessage("Unauthorized access! Redirecting to login...");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "Admin") {
          setSnackbarMessage("Access denied! Only Admins can access this page.");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setSnackbarMessage("Invalid session! Redirecting to login...");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
      {/* Top Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          background: "linear-gradient(to right, #6a11cb, #2575fc)", 
          height: "90px", 
          display: "flex", 
          justifyContent: "center", 
          mb: 4 
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Avatar sx={{ bgcolor: "white", color: "#1976d2", fontWeight: "bold" }}>
            A
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Dashboard Cards */}
      <Grid container spacing={3} justifyContent="center">
        {[
          {
            title: "Manage Events",
            description: "Organize and oversee upcoming events seamlessly.",
            icon: <Event sx={{ fontSize: 60, color: "#6a11cb" }} />,
            buttonText: "Go to Events",
            path: "/admin-event",
          },
          {
            title: "Manage Gallery",
            description: "Upload and maintain a collection of event photos.",
            icon: <PhotoLibrary sx={{ fontSize: 60, color: "#6a11cb" }} />,
            buttonText: "Go to Gallery",
            path: "/admin-gallery",
          },
          {
            title: "Manage Alumni",
            description: "Keep track of alumni and update their profiles. This section includes verification of alumni information, approving or rejecting alumni requests, and handling alumni-related queries.",
            icon: <People sx={{ fontSize: 60, color: "#6a11cb" }} />,
            buttonText: "Go to Alumni",
            path: "/admin-approval",
          },
          {
            title: "Manage Contact Details",
            description: "Maintain the contact details of the admin. Update email addresses, phone numbers, and office details.",
            icon: <ContactMail sx={{ fontSize: 60, color: "#6a11cb" }} />,
            buttonText: "Go to Contact Updation",
            path: "/admin-contact",
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={4}
              sx={{
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                },
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                p: 3,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {card.icon}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {card.description}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6a11cb",
                  "&:hover": { backgroundColor: "#4b0082" },
                  padding: "10px 20px",
                  fontWeight: "bold",
                  width: "80%",
                  alignSelf: "center",
                  mb: 2,
                }}
                onClick={() => navigate(card.path)}
              >
                {card.buttonText}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
