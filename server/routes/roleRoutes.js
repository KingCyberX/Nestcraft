const express = require("express");
const { createRole, getRoles, updateRole, deleteRole } = require("../controllers/roleController");
const { authenticateAndAuthorize } = require("../middleware/authMiddleware"); // Import the authentication and role-based authorization middleware

const router = express.Router();

router.post("/createrole", authenticateAndAuthorize(['super_admin']), createRole);

router.get("/getroles", authenticateAndAuthorize(['admin', 'super_admin']), getRoles);

router.put("/updaterole/:role_id", authenticateAndAuthorize(['super_admin']), updateRole);

router.delete("/deleterole/:role_id", authenticateAndAuthorize(['super_admin']), deleteRole);

module.exports = router;
