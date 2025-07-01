import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../images/psg-alumni-logo.png";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a00e0, #8e2de2)" }}>
      <Toolbar>
        <img src={Logo} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Alumni-Student Portal
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/mentorship/login">Login</Button>
        <Button color="inherit" component={Link} to="/mentorship">Mentorship</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
