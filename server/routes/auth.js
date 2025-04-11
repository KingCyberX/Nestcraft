const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/db"); // Ensure proper database connection is imported
const { checkPermission } = require("../middleware/permissions"); // Import the permission middleware
const router = express.Router();
// Helper function to validate user input
const validateUserInput = (name, email, password) => {
  if (!name || !email || !password) {
    return "All fields (name, email, and password) are required.";
  }
  return null;
};




router.post("/register", async (req, res) => {
  console.log("Registration request received");

  const { name, email, password, role_id } = req.body;

  // Input validation
  const validationError = validateUserInput(name, email, password);
  if (validationError) {
    console.log(validationError);
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check if the email already exists in the database
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      console.log("Email is already registered");
      return res.status(400).json({ error: "Email is already registered" });
    }

    // If role_id is not provided, set it to null
    const finalRoleId = role_id || null;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Insert the user into the database
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, finalRoleId]
    );
    console.log("User registered successfully", result);

    // Ensure result.insertId exists
    const userId = result.insertId; // The user ID from the users table insert

    if (!userId) {
      console.error("Failed to retrieve inserted user ID");
      return res
        .status(500)
        .json({ error: "Failed to retrieve inserted user ID" });
    }

    // Insert into user_roles table to link the user with their role
    const [roleResult] = await db.execute(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, finalRoleId]
    );

    // Check if user_roles insertion was successful
    if (roleResult.affectedRows > 0) {
      console.log("User role assigned successfully");
    } else {
      console.error("Failed to insert into user_roles");
      return res.status(500).json({ error: "Failed to assign role to user" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email, role_id: finalRoleId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("JWT Token generated successfully");

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Login route
router.post("/login", async (req, res) => {
  console.log("Login request received");

  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch user from the database
    const [users] = await db.execute(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      console.log("Invalid email or password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      console.log("Invalid email or password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all users along with their role_name using user_id = role_id
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT u.id, u.name, u.email, u.created_at, r.role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id  
JOIN roles r ON ur.role_id = r.id        

    `);
    res.status(200).json(users); // Send user data with role_name
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit user (Admins can edit, but not delete)
router.put(
  "/users/:id",
  checkPermission("user", "updateAny"),
  async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;

    try {
      const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : user[0].password_hash;

      // Update the user data
      const [result] = await db.execute(
        "UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?",
        [name, email, hashedPassword, id]
      );

      res.status(200).json({ message: "User updated successfully", result });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete user (only Super Admins can delete)
router.delete(
  "/users/:id",
  checkPermission("user", "deleteAny"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      await db.execute("DELETE FROM users WHERE id = ?", [id]);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


router.get("/roles", async (req, res) => {
  try {
    const [roles] = await db.execute("SELECT * FROM roles");
    res.status(200).json(roles); // Send roles data as a response
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
