import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore.js';
export const fetchUserTier = createAsyncThunk('users/fetchUserTier', async (userId, { rejectWithValue }) => {
  try {
    const response = await apiCore.get(`/usertiers/${userId}`);
    return { userId, tierId: response.data.tierId };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchAppAssignedTier = createAsyncThunk(
  'apps/fetchAssignedTiers',
  async (appId, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(`/userApps/getassignedtier/${appId}`);
      return { appId, assignedTiers: res.data.assignedTiers }; // assumed: res.data = [1, 3]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const assignTiersToApp = createAsyncThunk(
  'apps/assignTiers',
  async ({ appId, tierIds }, { rejectWithValue }) => {
    try {
      const appIdInt = Number(appId);
      const tierIdsInt = tierIds.map(id => Number(id));

      await apiCore.post(`/userApps/assignAppToTier/${appIdInt}`, { tierIds: tierIdsInt });
      return { appId: appIdInt, assignedTiers: tierIdsInt };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const assignUserTier = createAsyncThunk(
  'users/assignTier',
  async ({ userId, tierId }, { rejectWithValue }) => {
    try {
      await apiCore.post('/usertier/assigntier', { user_id:userId, tier_id:tierId });
      return { userId, tierId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchAllTiers = createAsyncThunk(
  'tiers/fetchAllTiers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCore.get('/userTier/gettiers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTierThunk = createAsyncThunk(
  'tiers/createTier',
  async (tierData, { rejectWithValue }) => {
    try {
      const response = await apiCore.post('/userTier/createtier', tierData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTierThunk = createAsyncThunk(
  'tiers/updateTier',
  async ({ tierId, tierDetails }, { rejectWithValue }) => {
    try {
      const response = await apiCore.put(`/userTier/updatetier/${tierId}`, tierDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTierThunk = createAsyncThunk(
  'tiers/deleteTier',
  async (tierId, { rejectWithValue }) => {
    try {
      const response = await apiCore.delete(`/userTier/deletetier/${tierId}`);
      return { tierId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Redux Slice
const userTierSlice = createSlice({
  name: 'userTier',
  initialState: {
    tiers: [],
    assignments: {},
    userTier: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAssignments(state, action) {
      state.assignments = action.payload;  // Ensure you correctly set the assignments state
    },
  },
  extraReducers: (builder) => {
    builder
 .addCase(fetchUserTier.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserTier.fulfilled, (state, action) => {
      state.loading = false;
      state.userTiers[action.payload.userId] = action.payload.tierId;
    })
    .addCase(fetchUserTier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Assign User Tier
    .addCase(assignUserTier.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(assignUserTier.fulfilled, (state, action) => {
      state.loading = false;
      state.userTiers[action.payload.userId] = action.payload.tierId;
    })
    .addCase(assignUserTier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchAllTiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTiers.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = action.payload;
      })
      .addCase(fetchAllTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTierThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTierThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers.push(action.payload);
      })
      .addCase(createTierThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTierThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTierThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = state.tiers.map(tier =>
          tier.id === action.payload.id ? action.payload : tier
        );
      })
      .addCase(updateTierThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTierThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTierThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = state.tiers.filter(tier => tier.id !== action.payload.tierId);
      })
      .addCase(deleteTierThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch App Assigned Tiers
      .addCase(fetchAppAssignedTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppAssignedTier.fulfilled, (state, action) => {
        const { appId, assignedTiers } = action.payload;
        state.tiers[appId] = assignedTiers;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAppAssignedTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch assigned tiers';
      })
    // Assign Tiers to App
      .addCase(assignTiersToApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTiersToApp.fulfilled, (state, action) => {
        const { appId, assignedTiers } = action.payload;
        state.assignments[appId] = assignedTiers;
        state.loading = false;
        state.error = null;
      })
      .addCase(assignTiersToApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to assign tiers';
      });
  },
});

export default userTierSlice.reducer;
