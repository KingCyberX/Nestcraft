// src/redux/slices/rolesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore.js';

// Fetch roles
export const fetchRoles = createAsyncThunk(
  'role/getroles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCore.get("role/getroles");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create role
export const createRole = createAsyncThunk(
  'roles/createRole',
  async ({ roleData, authToken }, { rejectWithValue }) => {
    try {
      const response = await apiCore.post("/roles", { role: roleData }, {
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

// Update role
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, roleData, authToken }, { rejectWithValue }) => {
    try {
      const response = await apiCore.update(`/roles/${id}`, { role: roleData }, {
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

// Delete role
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiCore.delete(`/roles/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((role) => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload.id);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rolesSlice.reducer;
