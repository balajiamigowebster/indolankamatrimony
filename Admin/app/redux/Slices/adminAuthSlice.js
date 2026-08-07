import API from "@/app/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  logoutMessage: null, // ✅ new state field for logout success message
};

export const fetchAdminDetailsOnLoad = createAsyncThunk(
  "adminAuth/fetchDetails",
  async (_, thunkAPI) => {
    try {
      const adminResponse = await API.get("/adminAuth/getMe");
      console.log(adminResponse);
      return adminResponse.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("No valid admin session found.");
    }
  }
);

/**
 * Thunk for Admin Login
 * @param {object} adminData - { email, password }
 */

export const loginAdmin = createAsyncThunk(
  "adminAuth/login",
  async (adminData, thunkAPI) => {
    try {
      // Step 1: Login (sets cookie)
      await API.post("/adminAuth/login", adminData);

      // Step 2: Fetch logged-in admin details
      const adminResponse = await API.get("/adminAuth/getMe");
      return adminResponse.data.admin;
    } catch (error) {
      const message =
        error?.response?.data?.message || // from backend
        error?.message || // from axios / network
        "Something went wrong during login"; // fallback
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "adminAuth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await API.post("/adminAuth/logout");
      console.log(response.data);
      return response.data?.message || "Logout successful";
    } catch (error) {
      const message =
        error?.response?.data?.message || // from backend
        error?.message || // from axios / network
        "Something went wrong during login"; // fallback
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "adminAuth/register",
  async (adminData, thunkAPI) => {
    try {
      const response = await API.post("/adminAuth/register", adminData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.logoutMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Details ---
      .addCase(fetchAdminDetailsOnLoad.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(fetchAdminDetailsOnLoad.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchAdminDetailsOnLoad.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
        state.admin = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      // --- Login ---
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.admin = null;
        state.isAuthenticated = false;
      })

      // --- ✅ Logout ---
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
        state.logoutMessage = null;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.error = null;
        state.logoutMessage = action.payload; // ✅ store success message
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // --- Register ---
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
