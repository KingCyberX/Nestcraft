// utils/accessControl.js
const AccessControl = require("accesscontrol");

const ac = new AccessControl();

// Define a function to dynamically load permissions for a role
const loadPermissionsForRole = (roleName) => {
  // Example role permissions, you can dynamically load this from the database
  const rolePermissions = {
    super_admin: ['createAny:user', 'readAny:user', 'updateAny:user', 'deleteAny:user'],
    admin: ['createAny:user', 'readOwn:user', 'updateAny:user'],
    editor: ['readOwn:user', 'updateOwn:user'],
    user: ['readOwn:user'],
  };

  return rolePermissions[roleName] || [];
};

// Dynamically grant permissions to a role
ac.grant = (roleName) => {
  const permissions = loadPermissionsForRole(roleName);
  permissions.forEach((perm) => {
    const [action, resource] = perm.split(":");
    ac.can(roleName)[action](resource);
  });
};

ac.grant("super_admin"); // Grants permissions dynamically based on the role
ac.grant("admin");
ac.grant("editor");
ac.grant("user");

module.exports = ac;
