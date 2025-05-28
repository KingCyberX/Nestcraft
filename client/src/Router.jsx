import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  Login,
  Register,
  ForgetPassword,
  Logout,
} from "./scenes";
import PermissionsPage from "./scenes/permissions";
import ThirdPartyApps from "./scenes/thirdpartyapps";
import ThirdPartySettings from "./scenes/thirdpartysettings";
// Check if the user is authenticated (token exists in localStorage)
const isAuthenticated = () => {
  const user = sessionStorage.getItem("authToken"); // Get the stored user data
  return user ? JSON.parse(user) : null; // Parse the user data if it exists, or return null if not
};


// Protected Route: Only accessible if authenticated
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const AppRouter = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner or some placeholder
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" /> // Redirect to dashboard if already logged in
            ) : (
              <Login />
            )
          }
        />
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes wrapped in App (with theme and layout) */}
        <Route element={<App />}>
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route path="/team" element={<ProtectedRoute element={<Team />} />} />
           <Route path="/Permissions" element={<ProtectedRoute element={<PermissionsPage />} />} />
           <Route path="/thirdpartyapps" element={<ProtectedRoute element={<ThirdPartyApps />} />} />
           <Route path="/thirdpartyappssettings" element={<ProtectedRoute element={<ThirdPartySettings />} />} />

          <Route
            path="/contacts"
            element={<ProtectedRoute element={<Contacts />} />}
          />
          <Route
            path="/invoices"
            element={<ProtectedRoute element={<Invoices />} />}
          />
          <Route path="/form" element={<ProtectedRoute element={<Form />} />} />
          <Route
            path="/calendar"
            element={<ProtectedRoute element={<Calendar />} />}
          />
          <Route path="/bar" element={<ProtectedRoute element={<Bar />} />} />
          <Route path="/pie" element={<ProtectedRoute element={<Pie />} />} />
          <Route
            path="/stream"
            element={<ProtectedRoute element={<Stream />} />}
          />
          <Route path="/line" element={<ProtectedRoute element={<Line />} />} />
          <Route path="/faq" element={<ProtectedRoute element={<FAQ />} />} />
          <Route
            path="/geography"
            element={<ProtectedRoute element={<Geography />} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
