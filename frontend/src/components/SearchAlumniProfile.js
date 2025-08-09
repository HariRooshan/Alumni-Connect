import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Import the autoTable plugin
import { TextField, Button, Checkbox, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Select, MenuItem, Divider, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
  const SearchAlumniProfile = () => {
    // PDF column selection state
    const allColumns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "yearOfGraduation", label: "Graduation Year" },
      { key: "programStudied", label: "Programme" },
      { key: "sector", label: "Sector" },
      { key: "higherStudies", label: "Higher Studies" },
      { key: "institutionName", label: "Institution" },
      { key: "currentCompany", label: "Company" },           // <-- Add this
      { key: "companyLocation", label: "Company Location" },
      { key: "job", label: "Job Title" },
      { key: "linkedinUrl", label: "LinkedIn" },
       // <-- Add this
    ];
    const columnWidths = {
  name: 200,
  email: 250,
  yearOfGraduation:130,
  programStudied: 180,
  sector: 120,
  higherStudies: 130,
  institutionName: 400,
  job: 400,
  linkedinUrl: 800,
  currentCompany: 180,
  companyLocation: 200,
  default: 140, // fallback
};
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdfColumns, setSelectedPdfColumns] = useState(allColumns.map(col => col.key));
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
    
   const handleFilterChange = (e) => {
  const { name, value } = e.target;

  setFilters((prev) => {
    let updatedFilters = { ...prev, [name]: value.trim() === "" ? "" : value };

    // 🔹 If Higher Studies is "No", reset Institution Name
    if (name === "higherStudies" && value === "No") {
      updatedFilters.institutionName = "";
    }

    // 🔹 Handle Location Dropdown
    if (name === "location") {
      updatedFilters.location = value;

      // ✅ If user selects "Other", keep previous customLocation
      // ✅ If user selects a normal option, clear customLocation
      updatedFilters.customLocation =
        value === "Other" ? prev.customLocation || "" : "";
    }

    // 🔹 Handle Custom Location Input
    if (name === "customLocation") {
      updatedFilters.customLocation = value;
    }

    // 🔹 Handle Company Dropdown
    if (name === "company") {
      updatedFilters.company = value;

      // ✅ If user selects "Other", keep previous customCompany
      // ✅ If user selects a normal option, clear customCompany
      updatedFilters.customCompany =
        value === "Other" ? prev.customCompany || "" : "";
    }

    // 🔹 Handle Custom Company Input
    if (name === "customCompany") {
      updatedFilters.customCompany = value;
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
    
      if (updatedSearchCount >= 10) {
        sendEmail(profile);
        setSearchCount(0);
        localStorage.setItem("searchCount", 0); // Reset after reaching threshold
      }
    };

    const keyMapping = {
      name: "name",
      email: "email",
      yearOfGraduation: "yearOfGraduation",
      sector: "sector",
      higherStudies: "higherStudies",
      institutionName: "institutionName",
      location: "companyLocation",
      company: "currentCompany",
    };

 const handleSearch = () => {
  if (!data || data.length === 0) {
    console.error("❌ No data available for searching.");
    return;
  }

  let cleanedFilters = {};

  // ✅ Handle Location
  if (filters.customLocation?.trim()) {
    cleanedFilters.companyLocation = filters.customLocation.trim().toLowerCase();
  } else if (filters.location?.trim() && filters.location.toLowerCase() !== "other") {
    cleanedFilters.companyLocation = filters.location.trim().toLowerCase();
  }

  // ✅ Handle Company
  if (filters.customCompany?.trim()) {
    cleanedFilters.currentCompany = filters.customCompany.trim().toLowerCase();
  } else if (filters.company?.trim() && filters.company.toLowerCase() !== "other") {
    cleanedFilters.currentCompany = filters.company.trim().toLowerCase();
  }

  // ✅ Handle Other Filters
  const otherFilterKeys = [
    "name",
    "email",
    "yearOfGraduation",
    "sector",
    "higherStudies",
    "institutionName",
  ];

  otherFilterKeys.forEach((key) => {
    const val = filters[key] ?? "";
    if (typeof val === "string" && val.trim() !== "") {
      cleanedFilters[key] = val.trim().toLowerCase();
    }
  });

  if (Object.keys(cleanedFilters).length === 0) {
    setFilteredData(data);
    return;
  }

  let filtered = [];
  for (let alumni of data) {
    let match = true;

    for (let key in cleanedFilters) {
      let alumniValue = alumni[key] ? alumni[key].toString().toLowerCase() : "";

      // ✅ Exact match for higherStudies
      if (key === "higherStudies") {
        if (alumniValue !== cleanedFilters[key]) {
          match = false;
          break;
        }
      }
      // ✅ Partial match for location
      else if (key === "companyLocation") {
        if (!alumni.companyLocation?.toLowerCase().includes(cleanedFilters.companyLocation)) {
          match = false;
          break;
        }
      }
      // ✅ Partial match for company
      else if (key === "currentCompany") {
        if (!alumni.currentCompany?.toLowerCase().includes(cleanedFilters.currentCompany)) {
          match = false;
          break;
        }
      }
      // ✅ For other text fields
      else {
        if (!alumniValue.startsWith(cleanedFilters[key])) {
          match = false;
          break;
        }
      }
    }

    if (match) filtered.push(alumni);
  }

  console.log("Filters:", filters);
  console.log("Cleaned Filters:", cleanedFilters);
  console.log("🔍 Filtered Data:", filtered);

  setFilteredData(filtered);
  suggestProfile(filtered);
  saveSearch(cleanedFilters);
};




    
    const suggestProfile = (searchedResults) => {
  if (!searchedResults || searchedResults.length === 0) {
    console.warn("⚠ No search results found to suggest a profile.");
    return;
  }

  const alumniFilter = filters["Name of the alumni"]?.toLowerCase();
  const sectorFilter = filters["Sector"]?.toLowerCase(); // Public / Private
  const gradYearFilter = parseInt(filters["Year of Graduation"], 10);
  const higherStudiesFilter = filters["Higher Studies"]?.toLowerCase();
  const institutionFilter = filters["Institution Name"]?.toLowerCase();

  const rankedProfiles = searchedResults.slice().sort((a, b) => {
    let scoreA = 0, scoreB = 0;

    // 🏷 Exact or partial name match
    const nameA = a["Name of the alumni"]?.toLowerCase() || "";
    const nameB = b["Name of the alumni"]?.toLowerCase() || "";
    if (alumniFilter && nameA.includes(alumniFilter)) scoreA += 3;
    if (alumniFilter && nameB.includes(alumniFilter)) scoreB += 3;

    // 🏭 Sector (no partial matching needed)
    const sectorA = a["Sector"]?.toLowerCase() || "";
    const sectorB = b["Sector"]?.toLowerCase() || "";
    if (sectorFilter && sectorA === sectorFilter) scoreA += 2;
    if (sectorFilter && sectorB === sectorFilter) scoreB += 2;

    // 🎓 Graduation Year
    const yearA = parseInt(a["Year of Graduation"], 10);
    const yearB = parseInt(b["Year of Graduation"], 10);
    if (gradYearFilter) {
      scoreA += 1 / (1 + Math.abs(yearA - gradYearFilter));
      scoreB += 1 / (1 + Math.abs(yearB - gradYearFilter));
    }

    // 📚 Higher Studies
    const hsA = a["Higher Studies"]?.toLowerCase() || "";
    const hsB = b["Higher Studies"]?.toLowerCase() || "";
    if (higherStudiesFilter && hsA === higherStudiesFilter) scoreA += 1;
    if (higherStudiesFilter && hsB === higherStudiesFilter) scoreB += 1;

    // 🏫 Institution
    const instA = a["Institution Name"]?.toLowerCase() || "";
    const instB = b["Institution Name"]?.toLowerCase() || "";
    if (institutionFilter && instA.includes(institutionFilter)) scoreA += 1;
    if (institutionFilter && instB.includes(institutionFilter)) scoreB += 1;

    return scoreB - scoreA;
  });

  const profile = rankedProfiles[0];
  if (!profile) {
    console.error("❌ No valid profile found to suggest.");
    return;
  }

  setSuggestedProfile(profile);
  console.log("✅ Suggested Profile:", profile);
  localStorage.setItem("suggestedProfile", JSON.stringify(profile));
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
// const keyMapping = {
//   name: "Name of the alumni",
//   email: "Email ID",
//   yearOfGraduation: "yearOfGraduation",
//   programme: "Name of the Programme",
//   sector: "Sector"
// };

const handleSort = (order, field) => {
  const apiField = keyMapping[field] || field; // Get corresponding API field

  console.log("🔍 Sorting By Field:", field);
  console.log("🔍 Using API Field:", apiField); // Debugging

  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = a[apiField];
    const valueB = b[apiField];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      return order === "asc"
        ? String(valueA).localeCompare(String(valueB)) // Sort strings alphabetically
        : String(valueB).localeCompare(String(valueA)); // Reverse order
    }
  });

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

  if (userRole === "Student") {
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


// Open dialog to select columns
const openPdfDialog = () => {
  setPdfDialogOpen(true);
};

const closePdfDialog = () => {
  setPdfDialogOpen(false);
};

const handlePdfColumnChange = (key) => {
  setSelectedPdfColumns((prev) =>
    prev.includes(key)
      ? prev.filter((col) => col !== key)
      : [...prev, key]
  );
};

const downloadPDF = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ You are not authorized to download the PDF.");
    return;
  }
  let userRole;
  try {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    alert("❌ Invalid session. Please log in again.");
    return;
  }
  
  // Only include selected columns
  const selectedCols = allColumns.filter(col => selectedPdfColumns.includes(col.key));
  if (selectedCols.length === 0) {
    alert("Please select at least one column.");
    return;
  }
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFont("helvetica", "bold");
  doc.text("Alumni Search Results", doc.internal.pageSize.width / 2, 30, { align: 'center' });
  doc.setFont("helvetica", "normal");
  const tableColumn = selectedCols.map(col => col.label);
  const tableRows = filteredData.map((alumni) =>
  selectedCols.map((col) => {
    const value = alumni[col.key];

    if (col.key === 'linkedinUrl') {
      if (!value || typeof value !== 'string') return "N/A";

      // Insert newline every 40 characters to simulate wrap
      return value.replace(/(.{40})/g, "$1\n");
    }

    return value || "N/A";
  })
);


  // Compact, clean, and centered style
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: 'center',
      valign: 'middle',
      overflow: 'linebreak',
      minCellHeight: 16,
    },
    headStyles: {
      fillColor: [106, 13, 173],
      textColor: [255, 255, 255],
      fontSize: 9,
      halign: 'center',
      valign: 'middle',
      fontStyle: 'bold',
    },
    bodyStyles: {
      cellPadding: 2,
      halign: 'center',
      valign: 'middle',
      textColor: [30, 30, 30],
    },
    alternateRowStyles: {
      fillColor: [248, 246, 255],
    },
    margin: { top: 50, bottom: 30, left: 20, right: 20 },
    tableWidth: 'auto',
    didDrawPage: (data) => {
      doc.setFontSize(7);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 20
      );
    },
    // Fit columns to page width
    autoSize: true,
    wordWrap: 'break-word',
  });
  doc.save("Alumni_Search_Results.pdf");
  closePdfDialog();
};

return (
  <Box sx={{ textAlign: "center", p: 0, bgcolor: "#f6f6fa", minHeight: "100vh" }}>
    {/* Title Bar */}
    <Box
      sx={{
        background: "linear-gradient(to right, #6a0dad 30%, #1e90ff 100%)",
        color: "white",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Typography variant="h4" sx={{ textTransform: "uppercase", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <SearchIcon sx={{ fontSize: 38, mr: 1 }} /> Alumni Search
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "97%",
        maxWidth: 1100,
        m: "30px auto",
        p: 3,
        bgcolor: "#f8f6ff",
        borderRadius: 5,
        boxShadow: '0 8px 32px 0 rgba(106,13,173,0.15)',
        border: "2px solid #6a0dad",
        background: 'linear-gradient(135deg, #f8f6ff 60%, #e3e6fa 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
  {/* Heading */}
      <Typography variant="h6" sx={{ color: "#6a0dad", fontWeight: "bold", mb: 1, letterSpacing: 1 }}>
        Search Filters
      </Typography>
      <Divider sx={{ width: '90%', mb: 2, bgcolor: '#6a0dad' }} />

  {/* First Row - Name, Graduation Year, Sector */}
      <Box sx={{ display: "flex", gap: 3, width: "80%", justifyContent: "center", mb: 1 }}>
        <TextField
          type="text"
          name="name"
          label="Name"
          placeholder="Enter Name"
          value={filters.name || ""}
          onChange={handleFilterChange}
          sx={{ flex: 1 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon sx={{ color: '#6a0dad' }} /></InputAdornment> }}
        />
        <TextField
          type="number"
          name="yearOfGraduation"
          label="Graduation Year"
          placeholder="e.g. 2005"
          value={filters.yearOfGraduation || ""}
          onChange={handleFilterChange}
          sx={{ flex: 1 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon sx={{ color: '#1e90ff' }} /></InputAdornment> }}
        />
        <Select
          name="sector"
          value={filters.sector || ""}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ flex: 1 }}
          startAdornment={<BusinessIcon sx={{ color: '#6a0dad', mr: 1 }} />}
        >
          <MenuItem value="">Select Sector</MenuItem>
          <MenuItem value="Public">Public</MenuItem>
          <MenuItem value="Private">Private</MenuItem>
        </Select>
        <Select
          name="location"
          value={filters.location || ""}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ flex: 1 }}
          startAdornment={<LocationOnIcon sx={{ color: '#1e90ff', mr: 1 }} />}
        >
          <MenuItem value="">Select Location</MenuItem>
          <MenuItem value="Coimbatore">Coimbatore</MenuItem>
          <MenuItem value="Chennai">Chennai</MenuItem>
          <MenuItem value="Bengaluru">Bengaluru</MenuItem>
          <MenuItem value="Hyderabad">Hyderabad</MenuItem>
          <MenuItem value="Mumbai">Mumbai</MenuItem>
          <MenuItem value="Pune">Pune</MenuItem>
          <MenuItem value="Nagpur">Nagpur</MenuItem>
          <MenuItem value="Delhi">Delhi</MenuItem>
          <MenuItem value="Kolkata">Kolkata</MenuItem>
          <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {filters.location === "Other" && (
          <TextField
            type="text"
            name="customLocation"
            label="Enter City"
            placeholder="Enter City Name"
            value={filters.customLocation || ""}
            onChange={handleFilterChange}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: '#1e90ff' }} /></InputAdornment> }}
          />
        )}
      </Box>
      <Divider sx={{ width: '90%', mb: 2, bgcolor: '#1e90ff' }} />

  {/* Second Row - Higher Studies, Institution Name (Conditional), Company */}
      <Box sx={{ display: "flex", gap: 3, width: "80%", justifyContent: "center", mb: 1 }}>
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
          startAdornment={<SchoolIcon sx={{ color: '#6a0dad', mr: 1 }} />}
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
            InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon sx={{ color: '#1e90ff' }} /></InputAdornment> }}
          />
        )}

        <Select
          name="company"
          value={filters.company || ""}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ flex: 1 }}
          startAdornment={<WorkIcon sx={{ color: '#6a0dad', mr: 1 }} />}
        >
          <MenuItem value="">Select Company</MenuItem>
          <MenuItem value="TCS">TCS</MenuItem>
          <MenuItem value="Infosys">Infosys</MenuItem>
          <MenuItem value="Wipro">Wipro</MenuItem>
          <MenuItem value="HCL">HCL</MenuItem>
          <MenuItem value="Tech Mahindra">Tech Mahindra</MenuItem>
          <MenuItem value="Cognizant">Cognizant</MenuItem>
          <MenuItem value="Accenture">Accenture</MenuItem>
          <MenuItem value="Capgemini">Capgemini</MenuItem>
          <MenuItem value="IBM">IBM</MenuItem>
          <MenuItem value="L&T Infotech">L&T Infotech</MenuItem>
          <MenuItem value="Mindtree">Mindtree</MenuItem>
          <MenuItem value="Oracle">Oracle</MenuItem>
          <MenuItem value="Amazon">Amazon</MenuItem>
          <MenuItem value="Microsoft">Microsoft</MenuItem>
          <MenuItem value="Google">Google</MenuItem>
          <MenuItem value="SAP">SAP</MenuItem>
          <MenuItem value="Deloitte">Deloitte</MenuItem>
          <MenuItem value="EY">EY</MenuItem>
          <MenuItem value="PwC">PwC</MenuItem>
          <MenuItem value="ZS Associates">ZS Associates</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {filters.company === "Other" && (
          <TextField
            type="text"
            name="customCompany"
            label="Enter Company"
            placeholder="Enter Company Name"
            value={filters.customCompany || ""}
            onChange={handleFilterChange}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: '#1e90ff' }} /></InputAdornment> }}
          />
        )}
      </Box>
      <Divider sx={{ width: '90%', mb: 2, bgcolor: '#6a0dad' }} />

  {/* Sorting Buttons */}
      <Box sx={{ display: "flex", gap: 3, width: "55%", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #1e90ff 0%, #6a0dad 100%)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 3,
            boxShadow: '0 2px 8px 0 rgba(30,144,255,0.10)',
            letterSpacing: 1,
            px: 2,
            py: 1,
            fontSize: 14,
            minWidth: 110,
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            '&:hover': {
              background: 'linear-gradient(90deg, #6a0dad 0%, #1e90ff 100%)',
              boxShadow: '0 4px 12px 0 rgba(106,13,173,0.15)',
              transform: 'scale(1.05)',
            },
            flex: 1,
          }}
          onClick={() => handleSort("asc","yearOfGraduation")}
        >
          Sort Ascending
        </Button>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #1e90ff 0%, #6a0dad 100%)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 3,
            boxShadow: '0 2px 8px 0 rgba(30,144,255,0.10)',
            letterSpacing: 1,
            px: 2,
            py: 1,
            fontSize: 14,
            minWidth: 110,
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            '&:hover': {
              background: 'linear-gradient(90deg, #6a0dad 0%, #1e90ff 100%)',
              boxShadow: '0 4px 12px 0 rgba(106,13,173,0.15)',
              transform: 'scale(1.05)',
            },
            flex: 1,
          }}
          onClick={() => handleSort("desc","yearOfGraduation")}
        >
          Sort Descending
        </Button>
      </Box>

      {/* Search Button */}
      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(90deg, #1e90ff 0%, #6a0dad 100%)',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: 3,
          boxShadow: '0 2px 8px 0 rgba(30,144,255,0.10)',
          letterSpacing: 1,
          px: 2,
          py: 1,
          fontSize: 14,
          minWidth: 110,
          mt: 2,
          transition: 'all 0.2s',
          textTransform: 'uppercase',
          '&:hover': {
            background: 'linear-gradient(90deg, #6a0dad 0%, #1e90ff 100%)',
            boxShadow: '0 4px 12px 0 rgba(106,13,173,0.15)',
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleSearch}
      >
        <SearchIcon sx={{ mr: 1, fontSize: 18 }} /> Search
      </Button>
</Box>

    
    

<Box sx={{ mt: 5, mb: 5 }}>
  <TableContainer
    component={Paper}
    sx={{
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
          {allColumns.map((col) => {
            const colWidth = columnWidths[col.key] || columnWidths.default;
            return (
              <TableCell
                key={col.key}
                sx={{
                  bgcolor: "#6a0dad",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                }}
              >
                {col.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>

      <TableBody>
        {filteredData.length > 0 ? (
          filteredData.map((alumni, index) => (
            <TableRow key={index}>
              {allColumns.map((col, idx) => {
                const colWidth = columnWidths[col.key] || columnWidths.default;

                const commonStyles = {
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                };

                const cellStyles =
                  col.key === "linkedinUrl"
                    ? {
                        ...commonStyles,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }
                    : {
                        ...commonStyles,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      };

                return (
                  <TableCell key={idx} sx={cellStyles}>
                    {alumni[col.key] || "N/A"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={allColumns.length} sx={{ textAlign: "center" }}>
              No results found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>



    {/* PDF Column Selection Dialog */}
    <Dialog open={pdfDialogOpen} onClose={closePdfDialog}>
      <DialogTitle>Select Columns for PDF</DialogTitle>
      <DialogContent>
        <FormGroup>
          {allColumns.map((col) => (
            <FormControlLabel
              key={col.key}
              control={
                <Checkbox
                  checked={selectedPdfColumns.includes(col.key)}
                  onChange={() => handlePdfColumnChange(col.key)}
                />
              }
              label={col.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={closePdfDialog} color="secondary">Cancel</Button>
        <Button onClick={downloadPDF} color="primary" variant="contained">Download PDF</Button>
      </DialogActions>
    </Dialog>

    {userRole !== "Student"&&userRole !== "Alumni" && (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          onClick={openPdfDialog}
          sx={{
            background: 'linear-gradient(90deg, #1e90ff 0%, #6a0dad 100%)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 3,
            boxShadow: '0 2px 8px 0 rgba(30,144,255,0.10)',
            letterSpacing: 1,
            px: 2,
            py: 1,
            fontSize: 14,
            minWidth: 110,
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            '&:hover': {
              background: 'linear-gradient(90deg, #6a0dad 0%, #1e90ff 100%)',
              boxShadow: '0 4px 12px 0 rgba(106,13,173,0.15)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <SearchIcon sx={{ mr: 1, fontSize: 18 }} /> Download as PDF
        </Button>
      </Box>
    )}

</Box>
);
}
export default SearchAlumniProfile;