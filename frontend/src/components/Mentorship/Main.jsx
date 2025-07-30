import React, { useEffect, useState } from "react";
import { 
  Container, Tabs, Tab, Box,  Button, AppBar, Toolbar,Alert, IconButton, Menu, MenuItem,
  Typography, Snackbar, TextField, Avatar, Modal
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate,Link } from "react-router-dom";
import SettingsTab from "./Tabs/SettingsTab";
import ConnectionsTab from "./Tabs/ConnectionsTab";
import MentorTab from "./Tabs/MentorTab";
import MenteeTab from "./Tabs/MenteeTab";
import Navbar from "../NavBar";

const Main = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null); 
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertType, setAlertType] = useState("success");


  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Handle Profile Menu Open/Close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Load user info and fetch users
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // For debugging
  // useEffect(() => {
  //   console.log("Component rendered! Active Tab:", activeTab);
  //   // console.log("Pending Requests:", pendingRequests);
  //   console.log("role : ",sessionStorage.getItem("role"));
  // }, [activeTab]); // Runs when `activeTab` or `pendingRequests` change
    
  // 🔹 Send connection request
  const sendRequest = async (receiverId) => {

    console.log(user);
    try {
      const response = await fetch("http://localhost:5000/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: user.email, receiverId, message }),
      });

      const data = await response.json();
      
      if(data.message === "Connection request sent") {
        
        const emailReq = await fetch("http://localhost:5000/api/mail/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderMail : user.email , receiverId: receiverId, msg: message }),
      });

      // const emailRes = await emailReq.json();

      const emailRes = await emailReq.json();
      console.log(emailRes);


    }

    else{
      setAlertType("error");
    }

      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
      setSelectedUser(null); // Close modal after sending request
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

    // 🔹 Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  

  return (

    <>
    <Navbar/>
    {/* ✅ Navigation Bar with Account Dropdown */}
    <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              
          </Typography>


          {/* ✅ User Account Dropdown */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{sessionStorage.getItem("name")}</Typography>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar src={sessionStorage.getItem("picture")} alt={sessionStorage.getItem("name")} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
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
    
    <Container maxWidth="lg">
      {/* 🔹 Tabs for Mentor and Mentee */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Mentors" />
          <Tab label="Mentees" />
          <Tab label="Connections" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {/* 🔹 Mentor List */}
      {activeTab === 0 && <MentorTab
        mentors={mentors}
        user={user}
        setSelectedUser={setSelectedUser}
        setMentors={setMentors}/>}

      {/* 🔹 Mentee List */}
      {activeTab === 1 && <MenteeTab 
        mentees={mentees}
        setSelectedUser={setSelectedUser}
        setMentees={setMentees}/>}

      {/* 🔹 Tab 2: Connections Tab */}
      {activeTab === 2 && <ConnectionsTab 
        setSnackbarMessage={setSnackbarMessage} // passing values as props to child component
        setSnackbarOpen={setSnackbarOpen}/>} 

      {/* 🔹 Tab 3: Settings */}
      {activeTab === 3 && <SettingsTab />}

      {/* 🔹 View More Details Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <Box 
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
            bgcolor: "white", p: 4, boxShadow: 24, borderRadius: 3, width: 400
          }}
        >
          {selectedUser && selectedUser.role === "mentor" && (
            <>
              <Typography variant="h6">{selectedUser.firstName} {selectedUser.lastName}</Typography>
              <Typography>Industry: {selectedUser.industryOrDepartment}</Typography>
              <Typography>Experience: {selectedUser.experienceOrYear}</Typography>
              <Typography>Meeting Method: {selectedUser.meetingMethod}</Typography>
              <Typography>Education: {selectedUser.education}</Typography>
              {sessionStorage.getItem("role")==="mentee" && (
                <>
                <TextField 
                  label="Message (Optional)" 
                  fullWidth 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  sx={{ my: 2 }}
                />
                <Button variant="contained" fullWidth onClick={() => sendRequest(selectedUser._id)}>
                  Send Connection Request
                </Button>
                </>
              )}
              <Button fullWidth sx={{ mt: 1 }} onClick={() => setSelectedUser(null)}>Close</Button>
            </>
          )}

          {selectedUser && selectedUser.role === "mentee" && (
            <>
              <Typography variant="h6">{selectedUser.firstName} {selectedUser.lastName}</Typography>
              <Typography>Department: {selectedUser.industryOrDepartment}</Typography>
              <Typography>Year: {selectedUser.experienceOrYear}</Typography>
              <Typography>Meeting Method: {selectedUser.meetingMethod}</Typography>
              <Typography>Education: {selectedUser.education}</Typography>

              <Button fullWidth sx={{ mt: 1 }} onClick={() => setSelectedUser(null)}>Close</Button>
            </>
          )}
        </Box>
      </Modal>

      {/* 🔹 Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={ { vertical: "top", horizontal: "right" } }
        open={snackbarOpen}
        autoHideDuration={3000}
        size="large"
        message={snackbarMessage}
        // sx ={{width:"100%"}}
        onClose={() => setSnackbarOpen(false)}>
        <Alert size="large" severity={alertType} variant="filled" x={{fontSize:"2.5rem", width: "100%" }}>
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
};

export default Main;

