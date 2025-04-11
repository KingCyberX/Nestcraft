import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import rolesReducer from "./features/rolesSlice";  // Import the roles reducer


export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer, // Add roles reducer here
  },
});
