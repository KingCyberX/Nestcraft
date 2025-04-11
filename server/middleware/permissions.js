const ac = require("../utils/accessControl");

// Middleware to check permissions based on role
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ error: "Access denied, token required." });
    }

    try {
      // Decode the token to get the user details
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      // Fetch the user's role from the database
      const [user] = await db.execute(
        "SELECT role_id FROM users WHERE id = ?",
        [userId]
      );
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userRole = user[0].role_id;

      // Check if the user has the required permission
      const [role] = await db.execute(
        "SELECT role_name FROM roles WHERE id = ?",
        [userRole]
      );

      if (role.length === 0) {
        return res.status(404).json({ error: "Role not found" });
      }

      const permissions = ac.can(role[0].role_name);

      if (!permissions[resource] || !permissions[resource][action]) {
        return res
          .status(403)
          .json({ error: `Permission denied for ${action} on ${resource}` });
      }

      req.user = decoded; // Attach user data to the request
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = { checkPermission };
