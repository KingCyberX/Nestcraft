// routes/userRoleRoutes.js
const express = require("express");
const { assignRoleToUser, assignPermissionsToRole } = require("../controllers/userRoleController");

const router = express.Router();

router.post("/assign-role", assignRoleToUser);
router.post("/assign-permissions", assignPermissionsToRole);

module.exports = router;
