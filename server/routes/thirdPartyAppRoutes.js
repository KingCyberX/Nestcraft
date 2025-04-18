const express = require("express");
const {
  createThirdPartyApp,
  updateThirdPartyApp,
  deleteThirdPartyApp,
  assignAppToTier,
  removeAppFromTier,
  getAppsForTier
} = require("../controllers/thirdPartyAppController");

const { authenticateAndAuthorize } = require("../middleware/authRoleMiddleware"); // Authorization middleware
const router = express.Router();

// Protect routes with role-based authorization (admin or super_admin)
router.post("/createapp", authenticateAndAuthorize(['super_admin']), createThirdPartyApp);
router.put("/updateapp/:app_id", authenticateAndAuthorize(['super_admin']), updateThirdPartyApp);
router.delete("/deleteapp/:app_id", authenticateAndAuthorize(['super_admin']), deleteThirdPartyApp);
router.post("/assignapptotier", authenticateAndAuthorize(['super_admin']), assignAppToTier);
router.post("/removeapptotier", authenticateAndAuthorize(['super_admin']), removeAppFromTier);
router.get("/appsfortier/:tier_id", authenticateAndAuthorize(['admin', 'super_admin']), getAppsForTier);

module.exports = router;
