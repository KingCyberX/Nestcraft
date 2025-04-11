import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Logout = () => {
  const navigate = useNavigate(); // Hook to navigate after logout

  // Logout function to clear localStorage, sessionStorage and redirect to login
  const handleLogout = () => {
    // Clear everything from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("password");

    sessionStorage.clear(); 
    navigate("/login"); 
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
