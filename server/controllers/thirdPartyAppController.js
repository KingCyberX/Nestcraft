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
    const { app_id } = req.params;
  const { tierIds: newTierIds } = req.body; // Expect array of tier IDs from client

  if (!Array.isArray(newTierIds)) {
    return res.status(400).json({ error: "tierIds must be an array" });
  }

  try {
    // 1. Get existing assigned tiers for this app
    const [existingTiers] = await db.execute(
      "SELECT tier_id FROM tier_apps WHERE app_id = ?",
      [app_id]
    );
    const existingTierIds = existingTiers.map(row => row.tier_id);

    // 2. Determine tiers to insert and delete
    const toInsert = newTierIds.filter(id => !existingTierIds.includes(id));
    const toDelete = existingTierIds.filter(id => !newTierIds.includes(id));

    // 3. Delete tiers that are no longer assigned
    if (toDelete.length > 0) {
      await db.execute(
        `DELETE FROM tier_apps WHERE app_id = ? AND tier_id IN (${toDelete.map(() => '?').join(',')})`,
        [app_id, ...toDelete]
      );
    }

    // 4. Insert new tier assignments
    if (toInsert.length > 0) {
      const values = toInsert.map(tier_id => [app_id, tier_id]);
      await db.query(
        "INSERT INTO tier_apps (app_id, tier_id) VALUES ?",
        [values]
      );
    }

    // 5. Return the updated assignments
    res.json({ appId: app_id, assignedTiers: newTierIds });
  } catch (error) {
    console.error("Error assigning tiers to app:", error);
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
};// Get all apps assigned to a specific user
const getAppsForUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Get user role and access code
    const [users] = await db.execute(
      `SELECT u.access_code, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    const isAdmin = 
      (user.role_name === "super_admin" || user.role_name === "admin") ||
      (user.access_code === 1000 || user.access_code === 1001);

    if (isAdmin) {
      // Admin: select all apps with concatenated tier names and descriptions
      const [apps] = await db.execute(
        `SELECT 
           a.id, 
           a.app_name, 
           a.auth_token, 
           a.description AS app_description,
           a.image_url, 
           a.app_url,
           GROUP_CONCAT(DISTINCT t.tier_name) AS tiers_names,
           GROUP_CONCAT(DISTINCT t.description) AS tiers_descriptions
         FROM third_party_apps a
         LEFT JOIN tier_apps ta ON a.id = ta.app_id
         LEFT JOIN tiers t ON ta.tier_id = t.id
         GROUP BY a.id, a.app_name, a.auth_token, a.description, a.image_url, a.app_url`
      );

      return res.status(200).json(apps);
    } else {
      // Non-admin: get user's tier_id
      const [userTier] = await db.execute(
        "SELECT tier_id FROM users WHERE id = ?",
        [user_id]
      );

      if (userTier.length === 0) {
        return res.status(404).json({ error: "User tier not found" });
      }

      const tier_id = userTier[0].tier_id;

      // Get apps assigned to user's tier
      const [apps] = await db.execute(
        `SELECT 
           t.tier_name, 
           t.description AS tier_description,
           a.id, 
           a.app_name, 
           a.auth_token,
           a.description, 
           a.image_url, 
           a.app_url, 
           a.added 
         FROM third_party_apps a
         JOIN tier_apps ta ON a.id = ta.app_id
         JOIN tiers t ON t.id = ta.tier_id
         WHERE ta.tier_id = ?`,
        [tier_id]
      );

      if (apps.length === 0) {
        return res.status(404).json({ error: "No apps found for this user" });
      }

      return res.status(200).json(apps);
    }
  } catch (error) {
    console.error("Error fetching apps for user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all apps assigned to a specific user
const getAppsForTier = async (req, res) => {
  const { app_id } = req.params;

  try {

   const [tiers] = await db.execute(
    `SELECT t.id, t.tier_name
     FROM tiers t
     JOIN tier_apps ta ON t.id = ta.tier_id
     WHERE ta.app_id = ?`,
    [app_id]
  );

    res.json({ appId: app_id, assignedTiers: tiers.map(t => t.id) });
  } catch (error) {
    console.error("Error fetching apps for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const assignTiersToApp = async (req, res) => {
  const { app_id } = req.params;
  const { tierIds: newTierIds } = req.body; // Expect array of tier IDs from client

  if (!Array.isArray(newTierIds)) {
    return res.status(400).json({ error: "tierIds must be an array" });
  }

  try {
    // 1. Get existing assigned tiers for this app
    const [existingTiers] = await db.execute(
      "SELECT tier_id FROM tier_apps WHERE app_id = ?",
      [app_id]
    );
    const existingTierIds = existingTiers.map(row => row.tier_id);

    // 2. Determine tiers to insert and delete
    const toInsert = newTierIds.filter(id => !existingTierIds.includes(id));
    const toDelete = existingTierIds.filter(id => !newTierIds.includes(id));

    // 3. Delete tiers that are no longer assigned
    if (toDelete.length > 0) {
      await db.execute(
        `DELETE FROM tier_apps WHERE app_id = ? AND tier_id IN (${toDelete.map(() => '?').join(',')})`,
        [app_id, ...toDelete]
      );
    }

    // 4. Insert new tier assignments
    if (toInsert.length > 0) {
      const values = toInsert.map(tier_id => [app_id, tier_id]);
      await db.query(
        "INSERT INTO tier_apps (app_id, tier_id) VALUES ?",
        [values]
      );
    }

    // 5. Return the updated assignments
    res.json({ appId: app_id, assignedTiers: newTierIds });
  } catch (error) {
    console.error("Error assigning tiers to app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const rmAppsIs_AddedFromUserApps = async (req, res) => {
  const { user_id, row_id, actionType } = req.body;  // actionType should be 'add' or 'remove'

  try {
    // Step 1: Validate actionType
    if (actionType !== 'add' && actionType !== 'remove') {
      return res.status(400).json({ error: 'Invalid action type. Use "add" or "remove".' });
    }

    // Step 2: Prepare the query based on actionType
    let query;
    let queryParams;

    if (actionType === 'add') {
      // Action to add the app for the user
      query = 'UPDATE third_party_apps SET added = 1 WHERE id = ? AND user_id = ?';
      queryParams = [row_id, user_id];
    } else if (actionType === 'remove') {
      // Action to remove the app from the user's list
      query = 'UPDATE third_party_apps SET added = 0 WHERE id = ? AND user_id = ?';
      queryParams = [row_id, user_id];
    }

    // Step 3: Execute the query
    const [result] = await db.execute(query, queryParams);

    // Step 4: Check if any rows were affected (i.e., the app was updated)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'App not found for the specified user.' });
    }

    // Step 5: Fetch the updated list of apps (if needed, or return a success message)
    const [apps] = await db.execute(
      'SELECT * FROM third_party_apps WHERE user_id = ?',
      [user_id]
    );

    res.status(200).json({ message: 'App updated successfully.', apps });
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const GetAllApps = async (req, res) => {

  try {

    const [apps] = await db.execute(
      'SELECT * FROM third_party_apps',
    );

    res.status(200).json({ message: 'App Get successfully.', apps });
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const createauthtoken = async (req, res) => {
  const { id } = req.params;

  try {
    const authToken = crypto.randomUUID();

    const [result] = await db.execute(
      'UPDATE users SET auth_token = ? WHERE id = ?',
      [authToken, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Auth token generated', authToken });
  } catch (error) {
    console.error('Error updating user auth token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteApp = async (req, res) => {
  const appId = req.params.id;

  try {
    const [result] = await db.execute(
      'DELETE FROM third_party_apps WHERE id = ?',
      [appId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.status(200).json({ message: 'App deleted successfully.', id: parseInt(appId) });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const createApp = async (req, res) => {
  const { app_name, app_url, description, image_url, tier_name, tier_description } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO third_party_apps (app_name, app_url, description, image_url, tier_name, tier_description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [app_name, app_url, description, image_url, tier_name, tier_description]
    );

    const [newApp] = await db.execute(
      'SELECT * FROM third_party_apps WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newApp[0]);
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateApp = async (req, res) => {
  const appId = req.params.id;
  const { app_name, app_url, description, image_url, tier_name, tier_description } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE third_party_apps 
       SET app_name = ?, app_url = ?, description = ?, image_url = ?, tier_name = ?, tier_description = ?
       WHERE id = ?`,
      [app_name, app_url, description, image_url, tier_name, tier_description, appId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    const [updatedApp] = await db.execute(
      'SELECT * FROM third_party_apps WHERE id = ?',
      [appId]
    );

    res.status(200).json(updatedApp[0]);
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createThirdPartyApp,
  updateThirdPartyApp,
  deleteThirdPartyApp,
  assignAppToTier,
  removeAppFromTier,
  getAppsForUser,
  rmAppsIs_AddedFromUserApps,
  GetAllApps,updateApp,createApp,deleteApp,getAppsForTier,assignTiersToApp,createauthtoken
};
