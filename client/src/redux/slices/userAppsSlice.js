import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore.js';

const initialState = {
  apps: [],
  status: 'idle', 
  error: null,    
};

export const fetchApps = createAsyncThunk(
  'userApps/fetchApps',
  async (userId, { rejectWithValue }) => {
    try {
      // Use the userId argument passed to the thunk
      //const response = await apiCore.get(`/userApps/getAppsForUser/${userId}`);
      const response = await apiCore.get(`/userApps/getAppsForUser/${2}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }   
);

export const appAddedList = createAsyncThunk(
  'userApps/appAddedList',
  async ({ userId, appId, actionType }, { rejectWithValue }) => {
    try {
      // Define the API endpoint based on the actionType (add or remove)
      const url = `/userApps/updateAppToList/${userId}`;
        
      const response = await apiCore.post(url, { appId, actionType });

      // Return the updated app data from the response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAppThunk = createAsyncThunk(
  'apps/addAppThunk',
  async ({ userId, appId }, { dispatch }) => {
    try {
      await apiCore.post('/userApps/updateAppToList', { userId, appId,actionType:"add" });

      dispatch(addApp({ appId }));
    } catch (error) {
      console.error(error);
    }
  }
);

export const removeAppThunk = createAsyncThunk(
  'apps/removeAppThunk',
  async ({ userId, appId }, { dispatch }) => {
    try {
      await apiCore.post('/userApps/updateAppToList', { userId, appId,actionType:"remove" });

      dispatch(removeApp(appId));
    } catch (error) {
      console.error(error);
    }
  }
);

const userAppsSlice = createSlice({
  name: 'userApps',
  initialState,
  reducers: {
    addApp: (state, action) => {
      const { appId } = action.payload;
      const existingApp = state.apps.find((app) => app.appId === appId);
    
      if (existingApp) {
        existingApp.is_added = true;
        existingApp.addedAt = new Date().toISOString();
      } else {
        state.apps.push({
          appId,
          is_added: true,
          addedAt: new Date().toISOString(),
        });
      }
    },
    
    removeApp: (state, action) => {
      const app = state.apps.find((a) => a.appId === action.payload);
      if (app) {
        app.is_added = false;
      }
    }    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApps.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apps = action.payload.map(app => ({
          appId: app.id,
          appName: app.app_name,
          appUrl: app.app_url,
          description: app.description,
          imageUrl: app.image_url,
          is_added: Boolean(app.added),
          addedAt: new Date().toISOString(),
        }));
      })
      .addCase(fetchApps.rejected, (state, action) => {
        state.status = 'failed'; // Set failure state if an error occurs
        state.error = action.payload; // Store error message
      })
      .addCase(appAddedList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(appAddedList.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Update the state with the latest apps list from the backend response
        const updatedApps = action.payload;
        state.apps = updatedApps.map((app) => ({
          appId: app.id,
          appName: app.app_name,
          appUrl: app.app_url,
          description: app.description,
          imageUrl: app.image_url,
          is_added: Boolean(app.added),
          addedAt: new Date().toISOString(),
        }));
      })
      .addCase(appAddedList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addApp, removeApp } = userAppsSlice.actions;

export const userAppsReducer = userAppsSlice.reducer;
