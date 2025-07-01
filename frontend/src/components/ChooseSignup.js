import { Link } from "react-router-dom";
import { Container, Paper, Typography, Button, Box } from "@mui/material";

const ChooseSignup = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('Alumni_Image.jpg')", // Adjust path if needed
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
              color: "transparent",
            }}
            gutterBottom
          >
            Choose Your Signup Type
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Button
              component={Link}
              to="/signup/student"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                ":hover": { opacity: 0.8 },
              }}
            >
              Student Signup
            </Button>

            <Button
              component={Link}
              to="/signup/staff"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                ":hover": { opacity: 0.8 },
              }}
            >
              Staff Signup
            </Button>

            <Button
              component={Link}
              to="/signup/alumni"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                ":hover": { opacity: 0.8 },
              }}
            >
              Alumni Signup
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChooseSignup;
