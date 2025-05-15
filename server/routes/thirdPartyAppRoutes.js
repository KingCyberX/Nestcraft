const express = require("express");
const {
  createThirdPartyApp,
  updateThirdPartyApp,
  deleteThirdPartyApp,
  assignAppToTier,
  removeAppFromTier,
  getAppsForUser,rmAppsIs_AddedFromUserApps,GetAllApps,updateApp,createApp,deleteApp,getAppsForTier,createauthtoken
} = require("../controllers/thirdPartyAppController");

const { authenticateAndAuthorize } = require("../middleware/authMiddleware"); // Authorization middleware
const router = express.Router();

// Protect routes with role-based authorization (admin or super_admin)
router.post("/createapp", authenticateAndAuthorize(['super_admin']), createThirdPartyApp);
router.put("/updateapp/:app_id", authenticateAndAuthorize(['super_admin']), updateThirdPartyApp);
router.delete("/deleteapp/:app_id", authenticateAndAuthorize(['super_admin']), deleteThirdPartyApp);
router.post("/assignapptotier/:app_id", authenticateAndAuthorize(['super_admin']), assignAppToTier);
router.post("/removeapptotier", authenticateAndAuthorize(['super_admin']), removeAppFromTier);
router.get("/getAppsForUser/:user_id", authenticateAndAuthorize(['admin', 'super_admin']), getAppsForUser);
router.get("/getassignedtier/:app_id", authenticateAndAuthorize(['admin', 'super_admin']), getAppsForTier);
router.get("/updateAppToList", authenticateAndAuthorize(['admin', 'super_admin','user']), rmAppsIs_AddedFromUserApps);
router.get("/getallapps", authenticateAndAuthorize(['admin', 'super_admin']), GetAllApps);
router.put("/update/:id", authenticateAndAuthorize(['admin', 'super_admin']), updateApp);
router.post("/createApp", authenticateAndAuthorize(['admin', 'super_admin']), createApp);
router.delete( "/delete/:id", authenticateAndAuthorize(['admin', 'super_admin']), deleteApp);
router.get("/authtoken/:id", authenticateAndAuthorize(['admin', 'super_admin','user']), createauthtoken);

module.exports = router;
