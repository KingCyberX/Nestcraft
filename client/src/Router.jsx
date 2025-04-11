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

// Check if the user is authenticated (token exists in localStorage)
const isAuthenticated = () => {
  return localStorage.getItem("authToken"); // Check if the token exists
};

// Protected Route: Only accessible if authenticated
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const AppRouter = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner or some placeholder
  }

  return (
    <Router>
      <Routes>
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
