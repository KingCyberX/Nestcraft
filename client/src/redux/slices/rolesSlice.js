import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = "http://localhost:5000/api";

// Fetch roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/roles`);
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

// Create role
export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${roleData.authToken}`,
        },
        body: JSON.stringify(roleData.role),
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
const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default rolesSlice.reducer;
