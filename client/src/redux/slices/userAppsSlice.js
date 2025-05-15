import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore.js';

const initialState = {
  apps: [],
  status: 'idle', 
  error: null,    
};

export const fetchTierApps = createAsyncThunk(
  'userApps/fetchApps',
  async (userId, { rejectWithValue }) => {
    try {
      // Use the userId argument passed to the thunk
      const response = await apiCore.get(`/userApps/getAppsForUser/${userId}`);
      //const response = await apiCore.get(`/userApps/getAppsForUser/${2}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }   
);

export const createauthtoken = createAsyncThunk(
  'userApps/createauthtoken',
  async (userId, { rejectWithValue }) => {
    try {

      const response = await apiCore.get(`/userApps/authtoken/${userId}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }   
);
export const fetchAllApps = createAsyncThunk(
  'userApps/fetchAllApps',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiCore.get(`/userApps/getallapps`);
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
export const createAppThunk = createAsyncThunk(
  'apps/createApp',
  async (newApp, { rejectWithValue }) => {
    try {
      const response = await apiCore.post('/userApps/createApp', newApp);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppThunk = createAsyncThunk(
  'apps/updateApp',
  async (updatedApp, { rejectWithValue }) => {
    try {
      const response = await apiCore.put(`/userApps/updateApp/${updatedApp.id}`, updatedApp);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAppThunk = createAsyncThunk(
  'apps/deleteApp',
  async (appId, { rejectWithValue }) => {
    try {
      const response = await apiCore.delete(`/userApps/deleteApp/${appId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      .addCase(fetchTierApps.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTierApps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apps = action.payload.map(app => ({
          appId: app.id,
          appName: app.app_name,
          appUrl: app.app_url,
          description: app.description,
          imageUrl: app.image_url,
          tier_name: app.tier_name,
          description: app.tier_description,
          is_added: Boolean(app.added),
          addedAt: new Date().toISOString(),
        }));
      })
      .addCase(fetchTierApps.rejected, (state, action) => {
        state.status = 'failed'; // Set failure state if an error occurs
        state.error = action.payload; // Store error message
      })
      // Handle the fetchAllApps action
      .addCase(fetchAllApps.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllApps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apps = action.payload;
      })
      .addCase(fetchAllApps.rejected, (state, action) => {
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
          tier_name: app.tier_name,
          description: app.tier_description,
          is_added: Boolean(app.added),
          addedAt: new Date().toISOString(),
        }));
      })
      .addCase(appAddedList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle the addAppThunk action
  .addCase(createAppThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAppThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apps.push(action.payload); // Add new app to the state
      })
      .addCase(createAppThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store error message
      })

      // updateAppThunk
      .addCase(updateAppThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAppThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.apps.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) state.apps[index] = action.payload; // Update app
      })
      .addCase(updateAppThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store error message
      })

      // deleteAppThunk
      .addCase(deleteAppThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAppThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.apps.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) state.apps.splice(index, 1); // Remove app from state
      })
      .addCase(deleteAppThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store error message
      });
  },
});

export const { addApp, removeApp } = userAppsSlice.actions;

export const userAppsReducer = userAppsSlice.reducer;
