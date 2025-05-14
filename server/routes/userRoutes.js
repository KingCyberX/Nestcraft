// routes/userRoutes.js
const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { authenticateAndAuthorize } = require("../middleware/authMiddleware"); // Authorization middleware
const router = express.Router();

// Admin only can access this route
router.get("/getallusers", authenticateAndAuthorize(['admin', 'super_admin']), getAllUsers);

module.exports = router;
