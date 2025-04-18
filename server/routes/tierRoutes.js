const express = require("express");
const { createTier, getTiers, assignTierToUser ,updateUserTier} = require("../controllers/tierController");
const { authenticateAndAuthorize } = require("../middleware/authMiddleware"); // Authorization middleware
const router = express.Router();

// Protect routes with role-based authorization (admin or super_admin)
router.post("/createtier", authenticateAndAuthorize(['super_admin']), createTier);
router.get("/gettiers", authenticateAndAuthorize(['admin', 'super_admin']), getTiers);
router.post("/assigntier", authenticateAndAuthorize(['super_admin']), assignTierToUser);
router.put("/updatetier", authenticateAndAuthorize(['super_admin']), updateUserTier);

module.exports = router;
