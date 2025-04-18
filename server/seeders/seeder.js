const bcrypt = require('bcrypt');
const db = require('../utils/db'); // Import the database connection

const createSuperAdmin = async () => {
  const superAdmin = {
    username: 'super_admin',
    email: 'superadmin@example.com',
    password: 'supersecurepassword',
    role: 'super_admin',
    access_code: 1001, // Default access code for super admin
  };

  try {
    // Step 1: Check if 'super_admin' role exists
    const [role] = await db.execute('SELECT id FROM roles WHERE role_name = ?', [superAdmin.role]);

    let roleId;
    if (role.length === 0) {
      // If role doesn't exist, create it
      const [insertRole] = await db.execute('INSERT INTO roles (role_name) VALUES (?)', [superAdmin.role]);
      roleId = insertRole.insertId;  // Get the ID of the newly created role
      console.log(`✅ Created new role: ${superAdmin.role} with ID: ${roleId}`);
    } else {
      roleId = role[0].id;  // Use the existing role ID
      console.log(`✅ Role ${superAdmin.role} already exists with ID: ${roleId}`);
    }

    // Step 2: Check if super admin exists
    const [existingAdmin] = await db.execute('SELECT * FROM users WHERE email = ?', [superAdmin.email]);

    if (existingAdmin.length === 0) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(superAdmin.password, 10);

      // Insert the super admin into the users table with the hashed password
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password_hash, role_id, access_code) VALUES (?, ?, ?, ?, ?)',
        [superAdmin.username, superAdmin.email, hashedPassword, roleId, superAdmin.access_code]
      );
      console.log(`✅ Super Admin created with ID: ${result.insertId}`);

      // Step 3: Check if permissions exist
      const [permissions] = await db.execute('SELECT id FROM permissions'); // Get all permissions

      if (permissions.length === 0) {
        // Insert default permissions if none exist (you may want to add more default permissions)
        const defaultPermissions = [
          { permission_name: 'view_dashboard' },
          { permission_name: 'manage_users' },
          { permission_name: 'assign_roles' }
        ];

        for (let perm of defaultPermissions) {
          await db.execute('INSERT INTO permissions (permission_name) VALUES (?)', [perm.permission_name]);
          console.log(`✅ Permission ${perm.permission_name} created.`);
        }

        // Fetch updated permissions after insertion
        const [newPermissions] = await db.execute('SELECT id FROM permissions');
        console.log(`✅ Created ${newPermissions.length} permissions.`);
      }

      // Step 4: Assign all permissions to super admin
      const [allPermissions] = await db.execute('SELECT id FROM permissions'); // Get all permissions

      if (allPermissions.length > 0) {
        for (let permission of allPermissions) {
          await db.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, permission.id]);
        }
        console.log('✅ All permissions assigned to super admin.');
      } else {
        console.log('❌ No permissions found to assign.');
      }
    } else {
      console.log('❌ Super Admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
};

module.exports = createSuperAdmin;
