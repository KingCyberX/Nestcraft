import { configureStore } from "@reduxjs/toolkit"; // Import the roles reducer
import thirdPartyAppsReducer from './slices/thirdPartyAppsSlice';
import userTierReducer from './slices/userTierSlice';
import productsReducer from './slices/productsSlice';
import authReducer from './slices/authSlice';
import permissionsReducer from './slices/permissionsSlice';
import rolesReducer from './slices/rolesSlice';
export const store = configureStore({
  reducer: {
    thirdPartyApps: thirdPartyAppsReducer,
    userTier: userTierReducer,
    products: productsReducer,
    auth: authReducer,
    permissions: permissionsReducer,
    roles: rolesReducer,
  },
});
