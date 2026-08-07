import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import adminReducer from "./adminSlices/adminSlice";
import adminAuthReducer from "./adminSlices/adminAuthSlice";
import adminProfileReducer from "./adminSlices/profileSlice";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    admin: adminReducer,
    adminAuth: adminAuthReducer,
    adminProfile: adminProfileReducer,
  },
});

export default store;
