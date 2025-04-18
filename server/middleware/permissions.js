// middleware/permissions.js
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const ac = require("../utils/accessControl");

const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ error: "Access denied, token required." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      // Get user's role_id
      const [userRows] = await db.execute(
        "SELECT role_id FROM users WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const roleId = userRows[0].role_id;

      // Get role name from roles table
      const [roleRows] = await db.execute(
        "SELECT role_name FROM roles WHERE id = ?",
        [roleId]
      );

      if (roleRows.length === 0) {
        return res.status(404).json({ error: "Role not found" });
      }

      const roleName = roleRows[0].role_name;

      // Check if the role has permission to perform the action on the resource
      const isAllowed = ac.can(roleName)[action](resource).granted;

      if (!isAllowed) {
        return res.status(403).json({
          error: `Permission denied for ${action} on ${resource}`,
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Error verifying token or checking permissions:", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = { checkPermission };
