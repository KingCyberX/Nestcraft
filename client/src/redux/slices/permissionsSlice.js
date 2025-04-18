import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = "http://localhost:5000/api";

// Fetch all permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/permissions`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create permission
export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permissionData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${permissionData.authToken}`,
        },
        body: JSON.stringify(permissionData.permission),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data;
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default permissionsSlice.reducer;
