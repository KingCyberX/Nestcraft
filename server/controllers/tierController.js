const db = require("../utils/db");

// Create a new tier
const createTier = async (req, res) => {
  const { tier_name, description, permissions } = req.body;

  if (!tier_name || !permissions || permissions.length === 0) {
    return res.status(400).json({ error: "Tier name and permissions are required" });
  }

  try {
    // Check if the tier already exists
    const [existingTier] = await db.execute('SELECT * FROM tiers WHERE tier_name = ?', [tier_name]);

    if (existingTier.length > 0) {
      return res.status(400).json({ error: `Tier "${tier_name}" already exists` });
    }

    // Insert the new tier
    const [result] = await db.execute(
      "INSERT INTO tiers (tier_name, description) VALUES (?, ?)",
      [tier_name, description]
    );
    
    // Get the tier_id of the newly created tier
    const tier_id = result.insertId;

    // Check if the permissions already exist for the tier
    for (let permission_id of permissions) {
      const [existingPermission] = await db.execute(
        'SELECT * FROM tier_permissions WHERE tier_id = ? AND permission_id = ?',
        [tier_id, permission_id]
      );

      if (existingPermission.length === 0) {
        // Insert permission if it doesn't exist
        await db.execute(
          "INSERT INTO tier_permissions (tier_id, permission_id) VALUES (?, ?)",
          [tier_id, permission_id]
        );
      }
    }

    res.status(201).json({ message: "Tier created successfully with permissions", tierId: tier_id });
  } catch (error) {
    console.error("Error creating tier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get all tiers with their associated permissions
const getTiers = async (req, res) => {
  try {
    const [tiers] = await db.execute(`
      SELECT t.id, t.tier_name, t.description, GROUP_CONCAT(p.permission_name) AS permissions
      FROM tiers t
      LEFT JOIN tier_permissions tp ON t.id = tp.tier_id
      LEFT JOIN permissions p ON tp.permission_id = p.id
      GROUP BY t.id
    `);
    res.status(200).json(tiers);
  } catch (error) {
    console.error("Error fetching tiers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Assign tier to user
const assignTierToUser = async (req, res) => {
  const { user_id, tier_id } = req.body;

  if (!user_id || !tier_id) {
    return res.status(400).json({ error: "User ID and Tier ID are required" });
  }

  try {
    // Check if the user is admin or super admin
    const [userRole] = await db.execute('SELECT role_id FROM users WHERE id = ?', [user_id]);

    if (!userRole || userRole.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming role_id for admin is 1 and super_admin is 2 (adjust according to your schema)
    const adminRoles = [1, 2]; // Replace with actual admin role ids
    if (adminRoles.includes(userRole[0].role_id)) {
      return res.status(400).json({ error: "Cannot assign tier to admin or super admin" });
    }

    // Check if the user is already assigned to the tier
    const [existingAssignment] = await db.execute(
      "SELECT * FROM user_tiers WHERE user_id = ? AND tier_id = ?",
      [user_id, tier_id]
    );

    if (existingAssignment.length > 0) {
      return res.status(400).json({ error: "User already assigned to this tier" });
    }

    // Assign the tier to the user
    const [result] = await db.execute(
      "INSERT INTO user_tiers (user_id, tier_id) VALUES (?, ?)",
      [user_id, tier_id]
    );

    res.status(201).json({ message: "Tier assigned to user successfully" });
  } catch (error) {
    console.error("Error assigning tier to user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user's tier
const updateUserTier = async (req, res) => {
  const { user_id, new_tier_id } = req.body;

  if (!user_id || !new_tier_id) {
    return res.status(400).json({ error: "User ID and New Tier ID are required" });
  }

  try {
    // Check if the user is admin or super admin
    const [userRole] = await db.execute('SELECT role_id FROM users WHERE id = ?', [user_id]);

    if (!userRole || userRole.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming role_id for admin is 1 and super_admin is 2 (adjust according to your schema)
    const adminRoles = [1, 2]; // Replace with actual admin role ids
    if (adminRoles.includes(userRole[0].role_id)) {
      return res.status(400).json({ error: "Cannot update tier for admin or super admin" });
    }

    // Check if the user is already assigned to the new tier
    const [existingAssignment] = await db.execute(
      "SELECT * FROM user_tiers WHERE user_id = ? AND tier_id = ?",
      [user_id, new_tier_id]
    );

    if (existingAssignment.length > 0) {
      return res.status(400).json({ error: "User is already assigned to this tier" });
    }

    // Update the user's tier in the user_tiers table
    const [result] = await db.execute(
      "UPDATE user_tiers SET tier_id = ? WHERE user_id = ?",
      [new_tier_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "User's tier updated successfully" });
  } catch (error) {
    console.error("Error updating user's tier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { createTier, getTiers, assignTierToUser ,updateUserTier};
