import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore.js';

export const getallusers = createAsyncThunk('users/getallusers', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCore.get('/users/getallusers');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    userTiers: {}, // userId -> tierId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallusers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getallusers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(getallusers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

        },
});

export default userSlice.reducer;
