import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API URL
const API_URL = "http://localhost:5000/api";

// Create a new third-party app
export const createApp = createAsyncThunk(
  'thirdPartyApps/createApp',
  async (appData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/createapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appData.authToken}`,
        },
        body: JSON.stringify(appData.appDetails),
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

export const updateApp = createAsyncThunk(
  'thirdPartyApps/updateApp',
  async (appData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updateapp/${appData.appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appData.authToken}`,
        },
        body: JSON.stringify(appData.appDetails),
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

// Delete a third-party app
export const deleteApp = createAsyncThunk(
  'thirdPartyApps/deleteApp',
  async (appId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/deleteapp/${appId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
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
const thirdPartyAppsSlice = createSlice({
  name: 'thirdPartyApps',
  initialState: {
    apps: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createApp.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApp.fulfilled, (state, action) => {
        state.loading = false;
        state.apps.push(action.payload);
      })
      .addCase(createApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApp.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApp.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.apps.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.apps[index] = action.payload;
        }
      })
      .addCase(updateApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteApp.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteApp.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = state.apps.filter((app) => app.id !== action.payload.id);
      })
      .addCase(deleteApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default thirdPartyAppsSlice.reducer;
