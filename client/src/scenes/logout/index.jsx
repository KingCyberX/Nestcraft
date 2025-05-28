import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Logout = () => {
  const navigate = useNavigate(); // Hook to navigate after logout
  const dispatch = useDispatch();

  // Logout function to clear sessionStorage and Redux state
  const handleLogout = () => {
    // Remove authToken from sessionStorage
    sessionStorage.removeItem("authToken");
    
    // Clear localStorage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("password");

    // Clear Redux auth state
    dispatch(logout());
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
