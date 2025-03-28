const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EncryptionHelper = require("../utils/EncryptionHelper");

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Fetch user from MySQL database
    const [users] = await db.execute(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // // Fetch user role
    // const [roleResults] = await db.execute('CALL GetUserRoles(?)', [user.id]);
    // if (!roleResults?.[0]?.[0]) {
    //   return res.status(403).json({ error: 'No role assigned to this user' });
    // }

    // const role = roleResults[0][0].name;

    // // Fetch permissions for the user
    // const [permissionResults] = await db.execute('CALL GetUserPermissions(?)', [user.id]);

    // if (!permissionResults || permissionResults.length === 0) {
    //   return res.status(403).json({ error: 'No permissions assigned to this user' });
    // }

    // // Extract permission names into an array
    // const permissions = permissionResults.map(p => p.name);

    // Generate JWT Token
    const access_token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Prepare session data
    const session = {
      access_token,
      expires_at: Date.now() + 3600 * 1000, // Token expiry in 1 hour
    };

    // Return user with role, permissions, and session
    res.status(200).json({
      user: {
        id: EncryptionHelper.encrypt(`${user.id}:${role}`),
        email: user.email,
        permissions: permissions,
        role: role,
      },
      token: session.access_token,
      session,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     if (error) throw error;

//     // Assign admin role to all new users registering from outside
//     if (data.user) {
//       const { data: adminRole, error: roleError } = await supabase
//         .from('roles')
//         .select('id')
//         .eq('name', 'admin')
//         .single(1);

//       if (roleError) throw roleError;

//       if (adminRole) {
//         const { error: userRoleError } = await supabase
//           .from('user_roles')
//           .insert([
//             { user_id: data.user.id, role_id: adminRole.id }
//           ]);

//         if (userRoleError) throw userRoleError;
//       }

//       // Assign all permissions to admin role
//       const { data: permissions, error: permissionsError } = await supabase
//         .from('permissions')
//         .select('id');

//       if (permissionsError) throw permissionsError;

//       if (permissions && permissions.length > 0) {
//         const rolePermissions = permissions.map(permission => ({
//           role_id: adminRole.id,
//           permission_id: permission.id
//         }));

//         const { error: rolePermError } = await supabase
//           .from('role_permissions')
//           .insert(rolePermissions)
//           .onConflict(['role_id', 'permission_id'])
//           .ignore();

//         if (rolePermError) throw rolePermError;
//       }
//     }

//     res.status(201).json({
//       user: {
//         id: data.user.id,
//         email: data.user.email,
//         role: 'admin', // All new registrations are admins
//       },
//       token: data.session?.access_token || '',
//       session: data.session,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Logout
// router.post('/logout', async (req, res) => {
//   try {
//     const { error } = await supabase.auth.signOut();

//     if (error) throw error;

//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get current user
// router.get('/user', async (req, res) => {
//   try {
//     const userId = req.headers['user-id'];

//     if (!userId) {
//       return res.status(401).json({ error: 'User ID is required' });
//     }

//     const { data, error } = await supabase.auth.admin.getUserById(userId);

//     if (error) throw error;

//     if (!data.user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Get user role
//     let role = 'user';

//     const { data: hasAdminPermission, error: permError } = await supabase.rpc('user_has_permission', {
//       permission_name: 'manage_ledgers'
//     });

//     if (permError) throw permError;

//     if (hasAdminPermission) {
//       role = 'admin';
//     } else {
//       // Check if user is a supplier
//       const { data: supplierData, error: supplierError } = await supabase
//         .from('suppliers')
//         .select('id')
//         .eq('user_id', userId)
//         .maybeSingle();

//       if (supplierError) throw supplierError;

//       if (supplierData) {
//         role = 'supplier';
//       } else {
//         // Check if user is a customer
//         const { data: customerData, error: customerError } = await supabase
//           .from('customers')
//           .select('id')
//           .eq('user_id', userId)
//           .maybeSingle();

//         if (customerError) throw customerError;

//         if (customerData) {
//           role = 'customer';
//         }
//       }
//     }

//     res.status(200).json({
//       user: {
//         id: data.user.id,
//         email: data.user.email,
//         role,
//       }
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
