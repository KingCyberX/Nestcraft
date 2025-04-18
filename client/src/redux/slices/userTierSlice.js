import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API URL
const API_URL = "http://localhost:5000/api";

// Assign tier to user
export const assignTierToUser = createAsyncThunk(
  'userTier/assignTierToUser',
  async (tierData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/assigntier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tierData.authToken}`,
        },
        body: JSON.stringify({
          user_id: tierData.user_id,
          tier_id: tierData.tier_id,
        }),
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

// Update tier for user
export const updateUserTier = createAsyncThunk(
  'userTier/updateUserTier',
  async (tierData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updatetier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tierData.authToken}`,
        },
        body: JSON.stringify({
          user_id: tierData.user_id,
          new_tier_id: tierData.new_tier_id,
        }),
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

// Redux Slice
const userTierSlice = createSlice({
  name: 'userTier',
  initialState: {
    userTier: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignTierToUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignTierToUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userTier = action.payload;
      })
      .addCase(assignTierToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserTier.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserTier.fulfilled, (state, action) => {
        state.loading = false;
        state.userTier = action.payload;
      })
      .addCase(updateUserTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userTierSlice.reducer;
