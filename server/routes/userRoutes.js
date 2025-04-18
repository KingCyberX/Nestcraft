// routes/userRoutes.js
const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { checkPermission } = require("../middleware/permissions");

const router = express.Router();

// Admin only can access this route
router.get("/users", checkPermission("user", "readAny"), getAllUsers);

module.exports = router;
