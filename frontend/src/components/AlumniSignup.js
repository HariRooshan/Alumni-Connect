import { useNavigate } from "react-router-dom";
import Signup from "./Signup";

const AlumniSignup = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = (email) => {
    // Store email in localStorage to auto-fill in the registration form
    localStorage.setItem("userEmail", email);
    // Redirect to Alumni Registration Page
    navigate("/alumniregistration");
  };

  return <Signup role="Alumni" onSignupSuccess={handleSignupSuccess} />;
};

export default AlumniSignup;
