const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const config = require("../config/config");

// Password complexity regex
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Register Controller
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate input
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Username, email, password, and confirmPassword are required" });
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password and confirm password do not match" });
  }

  // Check password complexity
  if (!passwordComplexityRegex.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    });
  }

  try {
    // Check if the user with the given email already exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the role_id for 'user' role (hardcoded role)
    const [roleResult] = await db.execute('SELECT * FROM roles WHERE role_name = ?', ['user']);
    if (roleResult.length === 0) {
      return res.status(400).json({ error: "Role 'user' does not exist" });
    }
    const roleId = roleResult[0].id;

    // Insert the new user into the users table with the role_id (user)
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash, role_id, access_code) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, roleId, 10002] // Default access code for all users
    );
    console.log(`✅ User created with ID: ${result.insertId}`);
    // Respond with the user data and the JWT token
    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Get the user from the database
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const foundUser = user[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Fetch user role and permissions
    const [role] = await db.execute("SELECT * FROM roles WHERE id = ?", [foundUser.role_id]);
    const [permissions] = await db.execute(`
      SELECT p.permission_name
      FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      WHERE rp.role_id = ?`, [foundUser.role_id]);

    if (role.length === 0) {
      return res.status(500).json({ error: "Role not found" });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: foundUser.id,
        username: foundUser.name,
        email: foundUser.email,
        role: role[0].role_name,
        permissions: permissions.map(p => p.permission_name), // Get the list of permissions
      },
      // process.env.JWT_SECRET, // Secret key for JWT (ensure this is set in your .env file)
      config.jwtSecret,
      { expiresIn: '1h' } // Token expiration
    );

    // Send the user data and token as response
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: role[0].role_name,
        permissions: permissions.map(p => p.permission_name),
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { register, login };
