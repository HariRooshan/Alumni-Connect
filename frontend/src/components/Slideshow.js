// src/components/Slideshow.js
import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";

const Slideshow = () => {
  const images = [
    "https://via.placeholder.com/600x400?text=Image+1",
    "https://via.placeholder.com/600x400?text=Image+2",
    "https://via.placeholder.com/600x400?text=Image+3",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
      <Paper elevation={4} sx={{ overflow: "hidden", borderRadius: 2 }}>
        <img
          src={images[currentIndex]}
          alt="Slideshow"
          style={{ width: "600px", height: "400px", objectFit: "cover" }}
        />
      </Paper>
    </Box>
  );
};

export default Slideshow;
