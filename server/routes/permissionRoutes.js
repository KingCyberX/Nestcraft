// routes/permissionRoutes.js
const express = require("express");
const { createPermission, getPermissions, updatePermission, deletePermission, assignPermissionToRole, getPermissionsForRole, removePermissionFromRole } = require("../controllers/permissionController");
const { authenticateAndAuthorize } = require("../middleware/authMiddleware"); // Import the authentication and role-based authorization middleware

const router = express.Router();

router.post("/permissions",  authenticateAndAuthorize(['super_admin']),createPermission);
router.get("/permissions",  authenticateAndAuthorize(['super_admin']),getPermissions);
router.put("/permissions/:permission_id", authenticateAndAuthorize(['super_admin']), updatePermission);
router.delete("/permissions/:permission_id", authenticateAndAuthorize(['super_admin']), deletePermission);
router.post("/assignPermission", authenticateAndAuthorize(['super_admin']), assignPermissionToRole);
router.get("/getPermissions/:role_id", authenticateAndAuthorize(['admin', 'super_admin']), getPermissionsForRole);
router.delete("/removePermission", authenticateAndAuthorize(['super_admin']), removePermissionFromRole);

module.exports = router;
