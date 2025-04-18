// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./utils/db");
const createSuperAdmin = require("./seeders/seeder"); // Import the seeder

dotenv.config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// 🧪 Test DB Connection
db.query('SELECT 1 + 1 AS solution')
  .then(([rows]) => {
    console.log('✅ Connected to MySQL. Test Query Result:', rows[0].solution);
  })
  .catch((err) => {
    console.error('❌ MySQL Connection Failed:', err);
    process.exit(1);  // Exit the application if MySQL connection fails
  });

// 🔄 Load API Routes
console.log('🔄 Loading API routes...');
app.use("/api/auth", require("./routes/authRoutes"));  
app.use("/api/role", require("./routes/roleRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use("/api/userRole", require("./routes/userRoleRoutes"));
app.use("/api/userTier", require("./routes/tierRoutes"));

createSuperAdmin();

// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔚 Graceful Shutdown (properly closing MySQL pool)
process.on('SIGINT', () => {
  console.log("\nGracefully shutting down...");
  db.end(() => {
    console.log("MySQL pool closed.");
    process.exit(0);  // Exit gracefully after closing the pool
  });
});

// Handle uncaught exceptions (optional)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);  // Exit with failure status code
});

// Handle unhandled promise rejections (optional)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);  // Exit with failure status code
});
