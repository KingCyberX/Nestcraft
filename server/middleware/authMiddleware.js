const jwt = require('jsonwebtoken');
const db = require('../utils/db'); // Ensure this is imported for database queries
const config = require("../config/config");
// Authentication and Role-based Authorization Middleware
const authenticateAndAuthorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
      return res.status(403).json({ error: "Token required" });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded; // Attach the user info (decoded token) to the request object

      // Check if the user has the required role
      const { role } = req.user; // Get the role from the decoded token

      // If allowedRoles is not empty and the user's role is not in allowedRoles
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return res.status(403).json({ error: "Access denied, insufficient role" });
      }

      // Role check passed, proceed to the next middleware/route handler
      next();

    } catch (error) {
      console.error("Error in JWT verification:", error);
      res.status(403).json({ error: "Invalid token" });
    }
  };
};

module.exports = { authenticateAndAuthorize };
