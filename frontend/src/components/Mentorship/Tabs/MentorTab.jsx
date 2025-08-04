import { useEffect } from "react";
import { Grid,Typography,Avatar,Card,CardContent,CardActions, Button } from "@mui/material";

const MentorTab = ({mentors,user,setSelectedUser,setMentors}) => {

  useEffect(() => {
    fetchMentors();
  },[]);
  

  const fetchMentors = async() => {
    try {
      const mentorRes = await fetch("http://localhost:5000/api/users/list/mentor"); 
      const mentorData = await mentorRes.json();
  
      // Get current user email from sessionStorage
      const currentUserEmail = sessionStorage.getItem("email");
      
      // Filter out the current user
      const filteredMentors = mentorData.filter(user => user.email !== currentUserEmail);
      setMentors(filteredMentors);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <Grid container spacing={3} sx={{mb:5}}>
      {mentors.length === 0 ? (
        <Typography>No mentors available.</Typography>
      ) : (
        mentors.map((mentor) => (
          <Grid item xs={12} sm={6} md={4} key={mentor._id}>
            <Card 
              sx={{ 
                p: 2, boxShadow: 3, borderRadius: 3, textAlign: "center", 
                transition: "0.3s", 
                "&:hover": { boxShadow: 6, transform: "scale(1.05)" }
              }}
            >

              <Avatar 
                src={mentor.photo}
                sx={{  mx: "auto", mb: 2 }}
              />
              <CardContent sx={{ minHeight: 91.5 }}>
                <Typography variant="h6">{mentor.firstName} {mentor.lastName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Industry: {mentor.industryOrDepartment}
                </Typography>
                <Typography variant="body2">
                  Skills: {mentor.skills.slice(0, 3).join(", ") + (mentor.skills.length > 3 ? ", ..." : "")}
                </Typography>
              </CardContent>
              <CardActions>
              {user &&  (
                  <Button 
                    variant="contained" 
                    onClick={() => setSelectedUser(mentor)}
                    sx={{ mx: "auto" }}
                  >
                    View Details
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default MentorTab;