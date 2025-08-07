import { useEffect, useState } from "react";
import { 
  Container, Tabs, Tab, Box,  Button, Alert, Snackbar, TextField, Modal
} from "@mui/material";

import ProfileTab from "./Tabs/ProfileTab";
import ConnectionsTab from "./Tabs/ConnectionsTab";
import MentorTab from "./Tabs/MentorTab";
import MenteeTab from "./Tabs/MenteeTab";
import Navbar from "../NavBar";
import UserProfileDetails from "./Tabs/userProfileDetails"; 

const Main = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null); 
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

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
    } else{
      setAlertType("error");
    }
    setSnackbarMessage(data.message);
    setSnackbarOpen(true);
    setSelectedUser(null); // Close modal after sending request
    setMessage(""); // Clear message input
    } catch (error) {
      setSnackbarMessage("Error sending request.");
      setAlertType("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
    <Navbar/>
    <Container maxWidth="lg" sx={{mt:8}}>
      {/* 🔹 Tabs for Mentor and Mentee */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Mentors" />
          <Tab label="Mentees" />
          <Tab label="Connections" />
          <Tab label="Profile" />
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
      {activeTab === 3 && <ProfileTab />}

      {/* 🔹 View More Details Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <Box 
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
            bgcolor: "white", p: 4, boxShadow: 24, borderRadius: 3, width: 400
          }}
        >
          {selectedUser &&  (
            <>
              <UserProfileDetails profile={selectedUser} />
                {selectedUser.role === "mentor" && sessionStorage.getItem("role") === "mentee" && (
                  <>
                    <TextField 
                      label="Message (Optional)" 
                      fullWidth 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      sx={{ my: 2 }}
                    />
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => sendRequest(selectedUser._id)}
                    >
                      Send Connection Request
                    </Button>
                  </>
                )}
                <Button fullWidth sx={{ mt: 0 }} onClick={() => setSelectedUser(null)}>Close</Button>
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
        onClose={() => setSnackbarOpen(false)}>
        <Alert size="large" severity={alertType}>
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
};

export default Main;

