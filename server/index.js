// In your index.js (server entry point)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth"); // Make sure this is correct

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Register routes
app.use("/auth", authRoutes); // Ensure the /auth path is correct

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
