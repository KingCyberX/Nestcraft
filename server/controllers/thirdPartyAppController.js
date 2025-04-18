const db = require("../utils/db"); // Assuming db is already initialized

// Create a new third-party app
const createThirdPartyApp = async (req, res) => {
  const { app_name, auth_token, app_url } = req.body;

  if (!app_name || !auth_token || !app_url) {
    return res.status(400).json({ error: "App name, auth token, and app URL are required" });
  }

  try {
    // Check if the app already exists
    const [existingApp] = await db.execute('SELECT * FROM third_party_apps WHERE app_name = ?', [app_name]);

    if (existingApp.length > 0) {
      return res.status(400).json({ error: `App "${app_name}" already exists` });
    }

    // Insert the new third-party app into the database
    const [result] = await db.execute(
      "INSERT INTO third_party_apps (app_name, auth_token, app_url) VALUES (?, ?, ?)",
      [app_name, auth_token, app_url]
    );

    res.status(201).json({ message: "Third-party app created successfully", appId: result.insertId });
  } catch (error) {
    console.error("Error creating third-party app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing third-party app
const updateThirdPartyApp = async (req, res) => {
  const { app_name, auth_token, app_url } = req.body;
  const { app_id } = req.params;

  if (!app_name || !auth_token || !app_url) {
    return res.status(400).json({ error: "App name, auth token, and app URL are required" });
  }

  try {
    const [app] = await db.execute('SELECT * FROM third_party_apps WHERE id = ?', [app_id]);

    if (app.length === 0) {
      return res.status(404).json({ error: "App not found" });
    }

    // Update the app details
    await db.execute(
      "UPDATE third_party_apps SET app_name = ?, auth_token = ?, app_url = ? WHERE id = ?",
      [app_name, auth_token, app_url, app_id]
    );

    res.status(200).json({ message: "Third-party app updated successfully" });
  } catch (error) {
    console.error("Error updating third-party app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a third-party app
const deleteThirdPartyApp = async (req, res) => {
  const { app_id } = req.params;

  try {
    const [app] = await db.execute('SELECT * FROM third_party_apps WHERE id = ?', [app_id]);

    if (app.length === 0) {
      return res.status(404).json({ error: "App not found" });
    }

    // Delete the app
    await db.execute("DELETE FROM third_party_apps WHERE id = ?", [app_id]);

    // Also remove any related tier-app assignments
    await db.execute("DELETE FROM tier_apps WHERE app_id = ?", [app_id]);

    res.status(200).json({ message: "Third-party app deleted successfully" });
  } catch (error) {
    console.error("Error deleting third-party app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign a third-party app to a tier
const assignAppToTier = async (req, res) => {
  const { tier_id, app_id } = req.body;

  if (!tier_id || !app_id) {
    return res.status(400).json({ error: "Tier ID and App ID are required" });
  }

  try {
    // Check if the app is already assigned to the tier
    const [existingAssignment] = await db.execute(
      "SELECT * FROM tier_apps WHERE tier_id = ? AND app_id = ?",
      [tier_id, app_id]
    );

    if (existingAssignment.length > 0) {
      return res.status(400).json({ error: "App is already assigned to this tier" });
    }

    // Assign the app to the tier
    await db.execute(
      "INSERT INTO tier_apps (tier_id, app_id) VALUES (?, ?)",
      [tier_id, app_id]
    );

    res.status(201).json({ message: "App assigned to tier successfully" });
  } catch (error) {
    console.error("Error assigning app to tier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a third-party app from a tier
const removeAppFromTier = async (req, res) => {
  const { tier_id, app_id } = req.body;

  if (!tier_id || !app_id) {
    return res.status(400).json({ error: "Tier ID and App ID are required" });
  }

  try {
    // Check if the app is assigned to the tier
    const [existingAssignment] = await db.execute(
      "SELECT * FROM tier_apps WHERE tier_id = ? AND app_id = ?",
      [tier_id, app_id]
    );

    if (existingAssignment.length === 0) {
      return res.status(404).json({ error: "App not assigned to this tier" });
    }

    // Remove the app from the tier
    await db.execute(
      "DELETE FROM tier_apps WHERE tier_id = ? AND app_id = ?",
      [tier_id, app_id]
    );

    res.status(200).json({ message: "App removed from tier successfully" });
  } catch (error) {
    console.error("Error removing app from tier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all apps assigned to a specific tier
const getAppsForTier = async (req, res) => {
  const { tier_id } = req.params;

  try {
    const [apps] = await db.execute(
      "SELECT a.app_name, a.auth_token, a.app_url FROM third_party_apps a JOIN tier_apps ta ON a.id = ta.app_id WHERE ta.tier_id = ?",
      [tier_id]
    );

    res.status(200).json(apps);
  } catch (error) {
    console.error("Error fetching apps for tier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createThirdPartyApp,
  updateThirdPartyApp,
  deleteThirdPartyApp,
  assignAppToTier,
  removeAppFromTier,
  getAppsForTier
};
