// controllers/roleController.js
const db = require("../utils/db");

// Create a new role
const createRole = async (req, res) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ error: "Role name is required" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO roles (role_name) VALUES (?)",
      [role_name]
    );
    res.status(201).json({ message: "Role created successfully", roleId: result.insertId });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const [roles] = await db.execute("SELECT * FROM roles");
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a role
const updateRole = async (req, res) => {
  const { role_name } = req.body;
  const { role_id } = req.params;

  if (!role_name) {
    return res.status(400).json({ error: "Role name is required" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE roles SET role_name = ? WHERE id = ?",
      [role_name, role_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  const { role_id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM roles WHERE id = ?", [role_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createRole, getRoles, updateRole, deleteRole };
