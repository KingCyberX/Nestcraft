// utils/accessControl.js

const AccessControl = require("accesscontrol");

const ac = new AccessControl();

// Defining roles and permissions
ac.grant("super_admin")
  .createAny("user")
  .readAny("user")
  .updateAny("user")
  .deleteAny("user");

ac.grant("admin_lms").updateAny("user").readOwn("user");

ac.grant("admin_maintenance").updateOwn("user").readOwn("user");

ac.grant("user").readOwn("user");

ac.grant("volunteer").readOwn("user");

ac.grant("platinum_card_holder").readOwn("user");

ac.grant("gold_card_holder").readOwn("user");

ac.grant("bronze_card_holder").readOwn("user");

module.exports = ac;
