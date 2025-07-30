import React from "react";
import { useEffect } from "react";
import { Grid,Button, Typography, Card, CardContent, Avatar, CardActions } from "@mui/material";
// import { useSnackbar } from "notistack";

const MenteeTab = ({mentees,setSelectedUser,setMentees}) => {

  useEffect(() => {
    console.log("Hello");
    mentees.forEach((mentee) => {
      const img = new Image();
      img.src = mentee.photo;
    });
  }, [mentees]);
  

  useEffect(() => {
    fetchMentees();
  }, []);

  // 🔹 Fetch both mentors & mentees from backend
  const fetchMentees = async () => {
    try {
      const menteeRes = await fetch("http://localhost:5000/api/users/list/mentee");
      const menteeData = await menteeRes.json();
  
      // Get current user email from sessionStorage
      const currentUserEmail = sessionStorage.getItem("email");
      
      // Filter out the current user
      const filteredMentees = menteeData.filter(user => user.email !== currentUserEmail);
  
      // setMentors(filteredMentors);
      setMentees(filteredMentees);
    } catch (error) {
      console.error("Error fetching mentees:", error);
    }
  };

  return (
    <Grid container spacing={3} sx={{mb:5}}>
      {mentees.length === 0 ? (
        <Typography>No mentees available.</Typography>
        ) : (
        mentees.map((mentee) => (
          <Grid item xs={12} sm={6} md={4} key={mentee._id}>
            <Card 
              sx={{ 
                p: 2, boxShadow: 3, borderRadius: 3, textAlign: "center", 
                transition: "0.3s", 
                "&:hover": { boxShadow: 6, transform: "scale(1.05)" }
              }}
            >

              {/* {console.log("HI")} */}
              {/* {console.log(mentee.email+" photo = +"+mentee.photo)} */}
              
            <Avatar 
              // key={mentee._id} // Forces React to re-render the component
              src={mentee.photo} 
              sx={{mx: "auto" , mb:2}}
            />

            <CardContent sx={{ minHeight: 91.5 }}>
              <Typography variant="h6">{mentee.firstName} {mentee.lastName}</Typography>
              <Typography variant="body2" color="textSecondary">
                Department: {mentee.industryOrDepartment}
              </Typography>
              <Typography variant="body2">Looking to learn: {mentee.skills.slice(0,3).join(", ") }</Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setSelectedUser(mentee)}
                sx={{ mx: "auto" }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))
    )}
  </Grid>
  )
};

export default MenteeTab;