// controllers/userController.js
const db = require("../utils/db");

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT u.id, u.name, u.email, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUsers };
