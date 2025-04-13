import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Make sure the response includes the 'role' field
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async ({ name, email, role_id, password }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/auth/register", // The API endpoint for adding a user
        { name, email, password, role_id }, // Add password here
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // If user is added successfully, return the new user data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, name, email, password, role_id }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:5000/auth/users/${id}`,
        { name, email, password, role_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data; // If user is updated successfully, return updated user data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
 
const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the fetching of users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Populate users data with the response payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      // Handle adding a new user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add the new user to the data array
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      });
  },
});

export default usersSlice.reducer;
