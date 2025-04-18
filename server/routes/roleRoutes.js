// routes/roleRoutes.js
const express = require("express");
const { createRole, getRoles, updateRole, deleteRole } = require("../controllers/roleController");

const router = express.Router();

router.post("/roles", createRole);
router.get("/roles", getRoles);
router.put("/roles/:role_id", updateRole);
router.delete("/roles/:role_id", deleteRole);

module.exports = router;
