// controllers/userRoleController.js
const db = require("../utils/db");

// Assign a role to a user
const assignRoleToUser = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    // Ensure user exists
    const [userCheck] = await db.execute("SELECT * FROM users WHERE id = ?", [user_id]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assign role to user
    const [result] = await db.execute(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [user_id, role_id]
    );

    res.status(201).json({ message: "Role assigned to user successfully" });
  } catch (error) {
    console.error("Error assigning role to user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign permissions to a role
const assignPermissionsToRole = async (req, res) => {
  const { role_id, permission_ids } = req.body;

  try {
    // Ensure the role exists
    const [roleCheck] = await db.execute("SELECT * FROM roles WHERE id = ?", [role_id]);
    if (roleCheck.length === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Insert permissions into role_permissions table
    for (let permission_id of permission_ids) {
      await db.execute(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
        [role_id, permission_id]
      );
    }

    res.status(201).json({ message: "Permissions assigned to role successfully" });
  } catch (error) {
    console.error("Error assigning permissions to role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { assignRoleToUser, assignPermissionsToRole };
