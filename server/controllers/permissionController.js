// controllers/permissionController.js
const db = require("../utils/db");

// Create a new permission
const createPermission = async (req, res) => {
  const { permission_name } = req.body;

  if (!permission_name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  try {
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

module.exports = { createPermission, getPermissions, updatePermission, deletePermission };
