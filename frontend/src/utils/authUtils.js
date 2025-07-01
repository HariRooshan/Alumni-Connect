import { jwtDecode } from "jwt-decode";

const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Check if expired
  } catch (error) {
    return true; // If error in decoding, consider it expired
  }
};

export default isTokenExpired;
