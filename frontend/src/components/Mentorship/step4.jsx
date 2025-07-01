import React from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

const Step4 = ({ formData, setFormData, onBack, onNext }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm" sx={{pb:5}}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 5 }}>
        <Typography variant="h5" gutterBottom>
          Step 4: Additional Details
        </Typography>

        {/* {console.log(formData.role)} */}

        {/* Years of Experience / Year of Study */}
        <FormControl fullWidth sx={{ marginTop: 2 }} required>
          <InputLabel>
            {formData.role === "mentor" ? "Years of Experience" : "Year of Study"}
          </InputLabel>
          <Select
            name="experienceOrYear"
            value={formData.experienceOrYear || ""}
            onChange={handleChange}
            label={formData.role === "mentor" ? "Years of Experience" : "Year of Study"}
          >
            {formData.role === "mentor"
              ? ["0-1 year", "1-3 years", "3-10 years", "10-20 years","20+ years"].map((exp) => (
                  <MenuItem key={exp} value={exp}>
                    {exp}
                  </MenuItem>
                ))
              : [1, 2, 3, 4, 5].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>

        {/* Industry / Department */}
        <FormControl fullWidth sx={{ marginTop: 2 }} required>
          <InputLabel>
         {formData.role === "mentor" ? "Industry" : "Department"}
          </InputLabel>
          <Select
            name="industryOrDepartment"
            value={formData.industryOrDepartment || ""}
            onChange={handleChange}
            label={formData.role === "mentor" ? "Industry" : "Department"}
          >
            {formData.role === "mentor"
              ? [
                "Engineering and Manufacturing",
                "Environmental and Sustainability",
                "Finance and Banking",
                "Government and Public Administration",
                "Healthcare and Pharmaceuticals",
                "Hospitality and Tourism",
                "Human Resources and Talent Management",
                "Agriculture and Food",
                "Architecture and Urban Planning",
                "Arts and Creative Industries",
                "Consulting",
                "Consulting Services",
                "Data Science and Analytics",
                "Education and Academia",
                "Energy and Utilities",
                "Information Technology",
                "Legal Services",
                "Marketing and Advertising",
                "Media and Entertainment",
                "Music and Performing Arts",
                "Nonprofit and Social Services",
                "Real Estate and Construction",
                "Renewable Energy",
                "Retail and Consumer Goods",
                "Social Media and Digital Marketing",
                "Telecommunications",
                "Transportation and Logistics",
                "Venture Capital and Private Equity"
            ]
            .map((exp) => (
                  <MenuItem key={exp} value={exp}>
                    {exp}
                  </MenuItem>
                ))
              : [
                "Automobile Engineering",
                "Biomedical Engineering",
                "Civil Engineering",
                "Computer Science and Engineering",
                "Computer Science and Engineering (AI and ML)",
                "Electrical and Electronics Engineering",
                "Electronics and Communication Engineering",
                "Instrumentation and Control Engineering",
                "Mechanical Engineering",
                "Metallurgical Engineering",
                "Production Engineering",
                "Robotics and Automation Engineering",
                "Bio Technology",
                "Fashion Technology",
                "Information Technology",
                "Textile Technology",
                "Applied Science",
                "Computer Systems and Design"
            ]
            .map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>

        {/* <TextField
          fullWidth
          label={formData.role['role'] === "mentor" ? "Industry" : "Department"}
          name="industryOrDepartment"
          value={formData.industryOrDepartment || ""}
          onChange={handleChange}
          sx={{ marginTop: 2 }}
        /> */}

        {/* Preferred Meeting Method */}
        <FormControl fullWidth sx={{ marginTop: 2 }} required>
          <InputLabel>Preferred Meeting Method</InputLabel>
          <Select
            name="meetingMethod"
            value={formData.meetingMethod || ""}
            onChange={handleChange}
            label={"Preferred Meeting Method"}
          >
            {["In-person", "Online", "Hybrid"].map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Highest Level of Education */}
        <FormControl fullWidth sx={{ marginTop: 2 }} required>
          <InputLabel>Highest Level of Education</InputLabel>
          <Select
            name="education"
            value={formData.education || ""}
            onChange={handleChange}
            label="Highest Level of Education"
            required
            sx={{ mb: 2 }}
          >
            {["High School", "Bachelor's", "Master's", "PhD", "Other"].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={() => onNext(formData)}>
            Proceed
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step4;
