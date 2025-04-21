const db = require("../utils/db");

// Create a new permission
const createPermission = async (req, res) => {
  const { permission_name } = req.body;

  if (!permission_name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  try {
    // Check if the permission already exists
    const [existingPermission] = await db.execute('SELECT * FROM permissions WHERE permission_name = ?', [permission_name]);

    if (existingPermission.length > 0) {
      return res.status(400).json({ error: `Permission "${permission_name}" already exists` });
    }

    // Insert the new permission if it doesn't exist
    const [result] = await db.execute(
      "INSERT INTO permissions (permission_name) VALUES (?)",
      [permission_name]
    );
    res.status(201).json({ message: "Permission created successfully", permissionId: result.insertId });
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const [permissions] = await db.execute("SELECT * FROM permissions");
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a permission
const updatePermission = async (req, res) => {
  const { permission_name } = req.body;
  const { permission_id } = req.params;

  if (!permission_name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  try {
    // Check if the permission already exists
    const [existingPermission] = await db.execute('SELECT * FROM permissions WHERE permission_name = ? AND id != ?', [permission_name, permission_id]);

    if (existingPermission.length > 0) {
      return res.status(400).json({ error: `Permission "${permission_name}" already exists` });
    }

    // Update the permission if it doesn't conflict with existing permissions
    const [result] = await db.execute(
      "UPDATE permissions SET permission_name = ? WHERE id = ?",
      [permission_name, permission_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Permission not found" });
    }

    res.status(200).json({ message: "Permission updated successfully" });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a permission
const deletePermission = async (req, res) => {
  const { permission_id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM permissions WHERE id = ?", [permission_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Permission not found" });
    }

    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign a permission to a role
const assignPermissionToRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  if (!role_id || !permission_id) {
    return res.status(400).json({ error: "Role ID and Permission ID are required" });
  }

  try {
    // Check if the permission is already assigned to the role
    const [existingAssignment] = await db.execute('SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?', [role_id, permission_id]);

    if (existingAssignment.length > 0) {
      return res.status(400).json({ error: `Permission is already assigned to the role` });
    }

    // Assign the permission to the role
    const [result] = await db.execute(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
      [role_id, permission_id]
    );

    res.status(201).json({ message: "Permission assigned to role successfully", assignmentId: result });
  } catch (error) {
    console.error("Error assigning permission to role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get all permissions assigned to a role
const getPermissionsForRole = async (req, res) => {
  const { role_id } = req.params;

  try {
    const [permissions] = await db.execute(
      `
      SELECT p.id, p.permission_name, 
        CASE 
          WHEN rp.role_id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS is_assigned
      FROM permissions p
      LEFT JOIN role_permissions rp ON p.id = rp.permission_id AND rp.role_id = ?
      `,
      [role_id]
    );

    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions for role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a permission from a role
const removePermissionFromRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  if (!role_id || !permission_id) {
    return res.status(400).json({ error: "Role ID and Permission ID are required" });
  }

  try {
    // Remove the permission from the role
    const [result] = await db.execute(
      "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?",
      [role_id, permission_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "Permission removed from role successfully" });
  } catch (error) {
    console.error("Error removing permission from role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createPermission, getPermissions, updatePermission, deletePermission, assignPermissionToRole, getPermissionsForRole, removePermissionFromRole };
