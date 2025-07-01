import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Import the autoTable plugin
import {TextField,Button,Checkbox,Paper,Typography,Box,TableContainer,Table,TableHead,TableRow,TableBody,TableCell,Select,MenuItem} from "@mui/material";
  const SearchAlumniProfile = () => {
    const [data, setData] = useState([]); // Store all alumni data
    const [filteredData, setFilteredData] = useState([]); // Store search results
    const [filters, setFilters] = useState({}); // Store search filters
    const [selectedFilters, setSelectedFilters] = useState([]); // Active filters
    const [recentSearches, setRecentSearches] = useState([]); // Store search history
    const [suggestedProfile, setSuggestedProfile] = useState(null); // Suggested alumni profile
    const [searchCount, setSearchCount] = useState(0); // Track search count
    const [emailId, setEmailId] = useState(""); // Store logged-in user email
    const [higherStudies, setHigherStudies] = useState(""); // Track Higher Studies field
   // 🔹 Fetch alumni data, recent searches, and suggested profile on mount
    useEffect(() => {
      fetchAlumni();
      loadRecentSearches();
      loadSuggestedProfile();
      setFilters({});
      setSearchCount(0);
      const storedSearchCount = parseInt(localStorage.getItem("searchCount"), 10) || 0;
      setSearchCount(storedSearchCount); // Reset search count on mount
    }, []);
    
    useEffect(() => {
      console.log("Updated Filters:", filters);
    }, [filters]);
    
    // 🔹 Fetch alumni data from API
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/alumni/search");
        console.log(response.data);
        setData(response.data);
        setFilteredData(response.data); // Initially show all data
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };
    
    // 🔹 Handle filter changes
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
    
      setFilters((prev) => {
        let updatedFilters = { ...prev, [name]: value.trim() === "" ? "" : value };
    
        // If Higher Studies is "No", reset Institution Name
        if (name === "higherStudies" && value === "No") {
          updatedFilters.institutionName = "";
        }
    
        return updatedFilters;
      });
    };
    
    // 🔹 Save search history for logged-in user
    const saveSearch = (searchQuery) => {
      let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || {};
    
      if (!searchHistory[emailId]) searchHistory[emailId] = [];
    
      if (searchHistory[emailId].length >= 5) searchHistory[emailId].shift();
      searchHistory[emailId].push(searchQuery);
    
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      setRecentSearches(searchHistory[emailId]);
    };
    
    // 🔹 Load recent searches for logged-in user
    const loadRecentSearches = () => {
      let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || {};
      setRecentSearches(searchHistory[emailId] || []);
    };
    
    // 🔹 Update search count & send email if threshold is reached
    const updateSearchCount = (profile) => {
      let storedSearchCount = parseInt(localStorage.getItem("searchCount"), 10) || 0;
      const updatedSearchCount = storedSearchCount + 1;
    
      setSearchCount(updatedSearchCount);
      localStorage.setItem("searchCount", updatedSearchCount);
    
      console.log("Search count:", updatedSearchCount);
    
      if (updatedSearchCount >= 5) {
        sendEmail(profile);
        setSearchCount(0);
        localStorage.setItem("searchCount", 0); // Reset after reaching threshold
      }
    };


    const keyMapping = {
        name: "name",
        email: "email",
        yearOfGraduation: "yearOfGraduation",
        programme: "programme",
        sector: "sector",
        higherStudies: "higherStudies",
        institutionName: "institutionName",
      };

    // 🔹 Perform search based on selected filters
    const handleSearch = () => {
      if (!data || data.length === 0) {
        console.error("❌ No data available for searching.");
        return;
      }
    
      let cleanedFilters = {};
      
      // Preprocess filters once (Avoid redundant `.toLowerCase()`)
      Object.keys(filters).forEach((key) => {
        if (filters[key]?.trim() !== "") {
          cleanedFilters[key] = filters[key].trim().toLowerCase();
        }
      });
    
      if (Object.keys(cleanedFilters).length === 0) {
        setFilteredData(data);
        return;
      }
    
      
    
      // **Optimized Filtering**
      let filtered = [];
      for (let alumni of data) {
        let match = true; // Assume match, stop checking if false
    
        for (let key in cleanedFilters) {
          let actualKey = keyMapping[key] || key;
          let alumniValue = alumni[actualKey] ? alumni[actualKey].toString().toLowerCase() : "";
    
          if (actualKey === "higherStudies") {
            if (alumniValue !== cleanedFilters[key]) {
              match = false;
              break;
            }
          } else {
            if (!alumniValue.startsWith(cleanedFilters[key])) {
              match = false;
              break;
            }
          }
        }
    
        if (match) filtered.push(alumni);
      }
    
      console.log("🔍 Filtered Data:", filtered);
      setFilteredData(filtered);
      suggestProfile(filtered);
      saveSearch(cleanedFilters);
    };
    
    
    // 🔹 Suggest profile based on search filters
    const suggestProfile = (searchedResults) => {
      if (!searchedResults || searchedResults.length === 0) {
        console.warn("⚠️ No search results found to suggest a profile.");
        return;
      }
    
      const alumniFilter = filters["Name of the alumni"];
      const sectorFilter = filters["Sector"];
      const gradYearFilter = filters["Year of Graduation"];
      const higherStudiesFilter = filters["Higher Studies"];
      const institutionFilter = filters["Institution Name"];
    
      // 🔹 Weight-based Scoring
      const rankedProfiles = searchedResults.slice().sort((a, b) => {
        let scoreA = 0, scoreB = 0;
    
        // Exact name match gets highest priority
        if (alumniFilter && a["Name of the alumni"] === alumniFilter) scoreA += 3;
        if (alumniFilter && b["Name of the alumni"] === alumniFilter) scoreB += 3;
    
        // Sector relevance
        if (sectorFilter && a["Sector"] === sectorFilter) scoreA += 2;
        if (sectorFilter && b["Sector"] === sectorFilter) scoreB += 2;
    
        // Graduation Year proximity (recent graduates prioritized)
        if (gradYearFilter) {
          const diffA = Math.abs(a["Year of Graduation"] - gradYearFilter);
          const diffB = Math.abs(b["Year of Graduation"] - gradYearFilter);
          scoreA += (5 - diffA); // The closer the year, the higher the score
          scoreB += (5 - diffB);
        }
    
        // Higher Studies relevance
        if (higherStudiesFilter && a["Higher Studies"] === higherStudiesFilter) scoreA += 1;
        if (higherStudiesFilter && b["Higher Studies"] === higherStudiesFilter) scoreB += 1;
    
        // Institution match (if Higher Studies = "Yes")
        if (institutionFilter && a["Institution Name"] === institutionFilter) scoreA += 1;
        if (institutionFilter && b["Institution Name"] === institutionFilter) scoreB += 1;
    
        return scoreB - scoreA; // Sort descending
      });
    
      const profile = rankedProfiles[0];
    
      if (!profile) {
        console.error("❌ No valid profile found to suggest.");
        return;
      }
    
      setSuggestedProfile(profile);
      console.log("✅ Suggested Profile:", profile);
    
      localStorage.setItem("suggestedProfile", JSON.stringify(profile));
    
      // ✅ Call updateSearchCount only when a valid profile is found
      updateSearchCount(profile);
    };
    
    
const loadSuggestedProfile = () => {
const savedProfile = JSON.parse(localStorage.getItem("suggestedProfile"));
const savedCount = parseInt(localStorage.getItem("searchCount")) || 0;

if (savedProfile) {
  setSuggestedProfile(savedProfile);
}
setSearchCount(savedCount);
};

// Define the key mapping

const handleSort = (order, field) => {
  // Map field name to API key
  console.log(filteredData);
  const apiField = keyMapping[field] || field; // Get the corresponding API field

  console.log("🔍 Sorting By Field:", field);
  console.log("🔍 Using API Field:", apiField); // Debugging

  const sortedData = [...filteredData].sort((a, b) =>
    order === "asc" 
      ? a[apiField] - b[apiField] // Ascending order
      : b[apiField] - a[apiField] // Descending order
  );

  setFilteredData(sortedData);
};
const token = localStorage.getItem("token");
 console.log("Token from localStorage:", token);

 let EMAIL_ID = null; // Define EMAIL_ID initially

 let userRole=null;
 
if (token) {
  try {
     const decodedToken = jwtDecode(token); // Decode safely
     EMAIL_ID = decodedToken.email; // Extract email
     console.log("User Email:", EMAIL_ID);
     userRole = decodedToken.role;
   } catch (error) {
     console.error("Invalid token:", error);
   }
 }
 
 const sendEmail = async (profile) => {

  const decodedToken = jwtDecode(token); // Decode safely
  EMAIL_ID = decodedToken.email; // Extract email
  console.log("User Email:", EMAIL_ID);
  userRole = decodedToken.role;

  if(userRole=="Student")
  {
    if (!profile || !EMAIL_ID) {
      console.error("❌ Profile data or email ID is missing!");
      return;
    }
  
    console.log("📨 Sending email to:", EMAIL_ID);
    console.log("📬 Profile data:", profile);
  
    try {
      console.log("📨 Triggering email send request...");
  
      await axios.post("http://localhost:5000/api/auth/send-email", {
        email: EMAIL_ID, // Use decoded email ID
        profile, // Backend will handle formatting
      });
  
      console.log("✅ Email request sent successfully");
    } catch (error) {
      console.error("❌ Error triggering email:", error);
    }
  }
  
};

console.log(filteredData); // Check if data is structured correctly

const downloadPDF = () => {
  // 🔹 Get token from localStorage (or wherever it's stored)
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ You are not authorized to download the PDF.");
    return;
  }

  // 🔹 Decode JWT to get user role
  let userRole;
  try {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    alert("❌ Invalid session. Please log in again.");
    return;
  }

  // **✅ Proceed with PDF generation**
  const doc = new jsPDF("landscape"); // Landscape mode for better spacing

  doc.setFont("helvetica", "bold");
  doc.text("Alumni Search Results", 14, 10);
  doc.setFont("helvetica", "normal");

  const tableColumn = [
    "Name",
    "Email",
    "Graduation Year",
    "Programme",
    "Sector",
    "Higher Studies",
    "Institution",
    "Job Title",
    "LinkedIn",
  ];

  // **🔹 Corrected Data Field Mapping**
  const tableRows = filteredData.map((alumni) => [
    alumni.name || "N/A",
    alumni.email || "N/A",
    alumni.yearOfGraduation || "N/A",
    alumni.programme || "N/A",
    alumni.sector || "N/A",
    alumni.higherStudies || "N/A",
    alumni.institutionName || "N/A",
    alumni.job || "N/A",
    alumni.linkedinUrl || "N/A",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: "striped",
    styles: { fontSize: 9 }, // Reduce font size for better fit
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: { cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 35 }, // Name
      1: { cellWidth: 50 }, // Email
      2: { cellWidth: 25 }, // Graduation Year
      3: { cellWidth: 40 }, // Programme
      4: { cellWidth: 30 }, // Sector
      5: { cellWidth: 25 }, // Higher Studies
      6: { cellWidth: 45 }, // Institution
      7: { cellWidth: 50 }, // Job Title
      8: { cellWidth: 60 }, // LinkedIn
    },
    didDrawPage: (data) => {
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      ); // Page numbering
    },
    margin: { top: 30, bottom: 30 },
    tableWidth: "auto",
  });

  doc.save("Alumni_Search_Results.pdf");
};

return (
  <Box sx={{ textAlign: "center", p: 0 }}>
    {/* Title Bar */}
    <Box
      sx={{
        background: "linear-gradient(to right, #6a0dad 30%, #1e90ff 100%)",
        color: "white",
        p: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
        Alumni Search
      </Typography>
    </Box>

    <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    width: "95%",
    maxWidth: 1000,
    m: "30px auto",
    p: 1,
    bgcolor: "white",
    borderRadius: 2,
    boxShadow: 3,
    border: "3px solid #6a0dad",
  }}
>
  {/* Heading */}
  <Typography variant="h6" sx={{ color: "#6a0dad", fontWeight: "bold", mb: 1 }}>
    Search Filters
  </Typography>

  {/* First Row - Name, Graduation Year, Sector */}
  <Box sx={{ display: "flex", gap: 3, width: "80%", justifyContent: "center" }}>
    <TextField
      type="text"
      name="name"
      label="Name"
      placeholder="Enter Name"
      value={filters.name || ""}
      onChange={handleFilterChange}
      sx={{ flex: 1 }}
    />
    <TextField
      type="number"
      name="yearOfGraduation"
      label="Graduation Year"
      placeholder="Enter Graduation Year"
      value={filters.yearOfGraduation || ""}
      onChange={handleFilterChange}
      sx={{ flex: 1 }}
    />
    <TextField
      type="text"
      name="sector"
      label="Sector"
      placeholder="Enter Sector"
      value={filters.sector || ""}
      onChange={handleFilterChange}
      sx={{ flex: 1 }}
    />
  </Box>

  {/* Second Row - Higher Studies, Institution Name (Conditional), Company */}
  <Box sx={{ display: "flex", gap: 3, width: "80%", justifyContent: "center" }}>
    <Select
      name="higherStudies"
      value={higherStudies}
      onChange={(e) => {
        setHigherStudies(e.target.value);
        setFilters((prev) => ({
          ...prev,
          higherStudies: e.target.value,
          institutionName: e.target.value === "Yes" ? prev.institutionName : "",
        }));
      }}  
    
      displayEmpty
      sx={{ flex: 1 }}
    >
      <MenuItem value="">Higher Studies</MenuItem>
      <MenuItem value="Yes">Yes</MenuItem>
      <MenuItem value="No">No</MenuItem>
    </Select>

    {higherStudies === "Yes" && (
      <TextField
        type="text"
        name="institutionName"
        label="Institution Name"
        placeholder="Enter Institution Name"
        value={filters.institutionName || ""}
        onChange={handleFilterChange}
        sx={{ flex: 1 }}
      />
    )}

    <TextField
      type="text"
      name="company"
      label="Company"
      placeholder="Enter Company"
      value={filters.company || ""}
      onChange={handleFilterChange}
      sx={{ flex: 1 }}
    />
  </Box>

  {/* Sorting Buttons */}
  <Box sx={{ display: "flex", gap: 3, width: "50%", justifyContent: "center", mt: 2 }}>
    <Button
      variant="contained"
      sx={{ bgcolor: "#6a0dad", "&:hover": { bgcolor: "#4500b5" }, flex: 1 }}
      onClick={() => handleSort("asc","yearOfGraduation")}
    >
      Sort Ascending
    </Button>
    <Button
      variant="contained"
      sx={{ bgcolor: "#6a0dad", "&:hover": { bgcolor: "#4500b5" }, flex: 1 }}
      onClick={() => handleSort("desc","yearOfGraduation")}
    >
      Sort Descending
    </Button>
  </Box>

  {/* Search Button */}
  <Button
    variant="contained"
    sx={{
      bgcolor: "#6a0dad",
      "&:hover": { bgcolor: "#4d088a" },
      width: "30%",
      mt: 2,
    }}
    onClick={handleSearch}
  >
    Search
  </Button>
</Box>

    {/* Results Table */}
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        width: "95%",
        maxHeight: 400,
        overflowY: "auto",
        overflowX: "auto",
        margin: "auto",
        boxShadow: 3,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {filteredData.length > 0 &&
              Object.keys(filteredData[0])
                .filter((key) => key !== "_id")
                .map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      bgcolor: "#6a0dad",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {{
                      rollNumber: "Roll No.",
                      email: "Email",
                      name: "Name",
                      yearOfGraduation: "Graduation Year",
                      linkedinUrl: "LinkedIn",
                      job: "Job",
                      sector: "Sector",
                      higherStudies: "Higher Studies",
                      institutionName: "Higher Studies Institution",
                    }[key] || key}
                  </TableCell>
                ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((alumni, index) => (
              <TableRow key={index}>
                {Object.entries(alumni)
                  .filter(([key]) => key !== "_id")
                  .map(([key, value], idx) => (
                    <TableCell key={idx}>{value || "N/A"}</TableCell>
                  ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="100%" sx={{ textAlign: "center" }}>
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    {userRole != "Student" && (
  <Button 
    // sx={{pt:5,pb:5}}
    variant="contained" color="primary" onClick={downloadPDF}>
    Download as PDF
  </Button>
)}

</Box>
);
}

export default SearchAlumniProfile;