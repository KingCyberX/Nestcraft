require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./utils/db"); // Import MySQL connection (pool)
const bodyParser = require("body-parser");
// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
// Database Connection Check using a test query
db.query("SELECT 1 + 1 AS solution")
  .then(([rows]) => {
    console.log(
      "✅ Connected to Hostinger MySQL. Test Query Result:",
      rows[0].solution
    );
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err);
  });

// Routes
console.log("🔄 Loading API routes...");
app.use("/api/auth", require("./routes/auth"));
//app.use('/api/customers', require('./routes/customers'));
// app.use('/api/suppliers', require('./routes/suppliers'));
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/ledgers', require('./routes/ledgers'));
// app.use('/api/deploy', require('./routes/deploy'));
// app.use('/api/assignments', require('./routes/assignments'));
// app.use('/api/settings', require('./routes/settings'));
console.log("✅ All API routes loaded.");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
