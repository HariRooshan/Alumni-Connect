// import React, { useState } from "react";
// import { Container, Typography, FormGroup, FormControlLabel, Checkbox, Button, Paper, Box } from "@mui/material";

// // Sample skills list (same as those displayed in the Mentorship Dashboard)
// const skillsList = [
//   "Web Development",
//   "Data Science",
//   "Machine Learning",
//   "UI/UX Design",
//   "Project Management",
//   "Cybersecurity",
//   "Cloud Computing",
//   "Marketing",
// ];

// const Step3 = ({ onNext, onBack, formData, setFormData }) => {
//   const [selectedSkills, setSelectedSkills] = useState(formData.skills || []);

//   const handleSkillChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedSkills((prev) =>
//       checked ? [...prev, value] : prev.filter((skill) => skill !== value)
//     );
//   };

//   const handleProceed = () => {
//     onNext({ skills: selectedSkills });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 5 }}>
//         {/* Dynamic Title Based on Role */}
//         <Typography variant="h5" gutterBottom>
//           Step 3: {
//           formData.role === "mentor" ? "Offer Your Skills" : "Select Skills to Learn"
//           }
//         </Typography>

//         {/* Dynamic Description Based on Role */}
//         <Typography variant="body1" color="textSecondary" gutterBottom>
//           {formData.role === "mentor"
//             ? "What skills would you like to offer assistance as a mentor?"
//             : "What are you looking to learn from mentors?"}
//         </Typography>

//         {/* Skills List with Checkboxes */}
//         <FormGroup sx={{ textAlign: "left", marginTop: 2 }}>
//           {skillsList.map((skill) => (
//             <FormControlLabel
//               key={skill}
//               control={
//                 <Checkbox
//                   checked={selectedSkills.includes(skill)}
//                   onChange={handleSkillChange}
//                   value={skill}
//                 />
//               }
//               label={skill}
//             />
//           ))}
//         </FormGroup>

//         {/* Navigation Buttons */}
//         <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
//           <Button variant="outlined" onClick={onBack}>
//             Back
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleProceed} disabled={selectedSkills.length === 0}>
//             Proceed
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Step3;


import React, { useState } from "react";
import { Container, Typography, FormGroup, FormControlLabel, Checkbox, Button, Paper, Box } from "@mui/material";
import { useEffect} from "react";



// List of skills offered in the mentorship program
const skillOptions = [
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "UI/UX Design",
  "Cloud Computing",
  "Product Management",
  "Blockchain",
  "Marketing Strategies",
  "Entrepreneurship",
];

const Step3 = ({ onNext, onBack, formData, setFormData }) => {
  const [selectedSkills, setSelectedSkills] = useState(formData.skills || []);

  // Determine the text based on the role using if-else
  
  let titleText = "";
  let questionText = "";

  
  const role = formData.role;
  // console.log(role['role']);

  if (role === 'mentor') {
    // console.log("Yes")
    titleText = "Offer Your Skills";
    questionText = "What skills would you like to offer assistance as a mentor?";
  } else {
    // console.log("No")
    titleText = "Select Skills to Learn";
    questionText = "What are you looking to learn from mentors?";
  }

  const handleSkillChange = (event) => {
    const skill = event.target.value;
    // console.log(skill);
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleProceed = () => {
    formData.skills = selectedSkills;
    setFormData({ ...formData});
    // console.log(selectedSkills);
    onNext(role);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 5 , marginBottom: 5}}>
        {/* ✅ Title with If-Else Logic */}
        <Typography variant="h5" gutterBottom>
          Step 3: {titleText}
        </Typography>

        {/* ✅ Description with If-Else Logic */}
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {questionText}
        </Typography>

        <FormGroup sx={{ textAlign: "left", marginTop: 2 }}>
          {skillOptions.map((skill) => (
            <FormControlLabel
              key={skill}
              control={
                <Checkbox
                  checked={selectedSkills.includes(skill)}
                  onChange={handleSkillChange}
                  value={skill}
                />
              }
              label={skill}
            />
          ))}
        </FormGroup>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleProceed} disabled={selectedSkills.length === 0}>
            Proceed
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step3;
