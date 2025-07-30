import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Check if user is logged in

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ message: "You must log in to access the page!" }} />
  );
};

export default ProtectedRoute;
