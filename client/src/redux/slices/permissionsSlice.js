// src/redux/slices/permissionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore'; // Assuming apiCore utility is in this path

const API_URL = "http://localhost:5000/api";

// Fetch all permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/Permissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCore.get(`${API_URL}/permissions/Permissions`);
      return response.data;
    } catch (error) {                                                                         
      return rejectWithValue(error.message);
    }
  }
);

// Create permission
export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async ({ permissionData, authToken }, { rejectWithValue }) => {
    try {
      const response = await apiCore.post(`${API_URL}/permissions`, permissionData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update permission
export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, permissionData, authToken }, { rejectWithValue }) => {
    try {
      const response = await apiCore.update(`${API_URL}/permissions/${id}`, permissionData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Assign permission to role
export const assignPermissionToRole = createAsyncThunk(
  'permissions/assignPermissionToRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      const response = await apiCore.post(`${API_URL}/roles/${roleId}/permissions`, { permissionId }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchPermissionsForRole = createAsyncThunk(
  'permissions/fetchPermissionsForRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await apiCore.get(`${API_URL}/permissions/getPermissions/${roleId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove assigned permission from role
export const removeAssignedPermission = createAsyncThunk(
  'permissions/removeAssignedPermission',
  async ({ roleId, permissionId, authToken }, { rejectWithValue }) => {
    try {
      const response = await apiCore.delete(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return { roleId, permissionId }; // Return for Redux update
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update assigned permissions for a role
export const updateAssignedPermissionOfRole = createAsyncThunk(
  'permissions/updateAssignedPermissionOfRole',
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const response = await apiCore.put(`${API_URL}/roles/${roleId}/permissions`, {
        permissions,
      });
      return response.data; // Return updated permissions
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Redux slice
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    loading: false,
    error: null,
    rolePermissions: [], 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create permission
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update permission
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.permissions.findIndex((perm) => perm.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign permission to role
      .addCase(assignPermissionToRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignPermissionToRole.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the update to the role’s permissions
      })
      .addCase(assignPermissionToRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove assigned permission from role
      .addCase(removeAssignedPermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAssignedPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter(
          (perm) => perm.id !== action.payload.permissionId
        );
      })
      .addCase(removeAssignedPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPermissionsForRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissionsForRole.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissions = action.payload;
      })
      .addCase(fetchPermissionsForRole.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(updateAssignedPermissionOfRole.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateAssignedPermissionOfRole.fulfilled, (state, action) => {
          state.loading = false;
          state.rolePermissions = action.payload.permissions;
        })
        .addCase(updateAssignedPermissionOfRole.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export default permissionsSlice.reducer;
