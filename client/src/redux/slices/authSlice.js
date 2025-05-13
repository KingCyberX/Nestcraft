// src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCore } from '../../utils/APICore';

// Load initial auth data from sessionStorage
const storedAuth = sessionStorage.getItem('authToken');
const initialAuth = storedAuth ? JSON.parse(storedAuth) : null;

// User registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiCore.post('/register', userData);

      // Store the entire response.data (includes user and token)
      sessionStorage.setItem('authToken', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await apiCore.post('/auth/login', loginData);

      // Store the entire response.data
      sessionStorage.setItem('authToken', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialAuth?.user || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      sessionStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
