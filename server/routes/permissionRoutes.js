// routes/permissionRoutes.js
const express = require("express");
const { createPermission, getPermissions, updatePermission, deletePermission } = require("../controllers/permissionController");

const router = express.Router();

router.post("/permissions", createPermission);
router.get("/permissions", getPermissions);
router.put("/permissions/:permission_id", updatePermission);
router.delete("/permissions/:permission_id", deletePermission);

module.exports = router;
