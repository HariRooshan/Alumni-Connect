import { AppBar, Toolbar, Grid, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Styled components for consistency
const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(45deg, #6a1b9a, #2196F3)",
  boxShadow: "none",
});

const Title = styled(Typography)({
  flexGrow: 1,
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#fff",
  textAlign: "center",
});

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  textTransform: "none",
  fontWeight: "500",
  color: "#fff",
  textDecoration: "none",
}));

const NavBar = () => {
  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Title>Alumni Events</Title>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <NavButton component={Link} to="/admin">
              Admin
            </NavButton>
            <NavButton component={Link} to="/">
              Home
            </NavButton>
          </Grid>
        </Grid>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;