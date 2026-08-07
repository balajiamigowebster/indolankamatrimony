import API from "@/app/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// =========================================================
// ASYNC THUNKS (API Calls)
// =========================================================

export const registerProfile = createAsyncThunk(
  "profile/registerProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/profile/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Server error" }
      );
    }
  }
);

// ✅ Get all profiles

export const sendOtp = createAsyncThunk(
  "profile/sendOtp",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/profile/send-otp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //console.log("OTP Send Response:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to send OTP",
        }
      );
    }
  }
);

// (OTP Submit)

export const verifyOtpAndRegister = createAsyncThunk(
  "profile/verifyOtpAndRegister",
  async (otpData, { rejectWithValue }) => {
    try {
      // { email: string, otp: string }
      const res = await API.post("/profile/verify-and-register", otpData);
      //console.log("OTP Verify/Register Response:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

export const getAllProfiles = createAsyncThunk(
  "profile/getAllProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/profile/all");
      //console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Server error" }
      );
    }
  }
);

// ✅ Get single profile by ID
export const getProfileById = createAsyncThunk(
  "profile/getProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/profile/${id}`);
      //console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Server error" }
      );
    }
  }
);

// ✅ Get filtered profiles by search query (id or name)
export const searchProfiles = createAsyncThunk(
  "profile/searchProfiles",
  async (search, { rejectWithValue }) => {
    try {
      // if search empty => load all profiles
      const endpoint = search
        ? `/profile/all?search=${encodeURIComponent(search)}`
        : "/profile/all";
      const res = await API.get(endpoint);
      //console.log("🔍 Search result:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Server error" }
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
    profiles: [], // for all profiles
    // 🔥 OTP Verification State Fields
    otpSent: false,
    otpError: null,
  },
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
      state.otpSent = false;
      state.otpError = null;
    },

    // OTP sent state
    resetOtpState: (state) => {
      state.loading = false;
      state.otpSent = false;
      state.otpError = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(registerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ------------------------------------
      // 🔥 1. sendOtp
      // ------------------------------------

      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.otpSent = false;
        state.otpError = null;
      })

      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // Registration is not yet complete
        state.otpSent = true;
        state.data = action.payload; // OPTIONAL: Save response if needed
      })

      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.error = action.payload.message;
        state.otpError = action.payload.message; // OTP-Specific error
      })

      // ------------------------------------
      // 🔥 2. verifyOtpAndRegister (Final Step)
      // ------------------------------------

      .addCase(verifyOtpAndRegister.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.otpError = null;
      })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.otpSent = false;
        state.data = action.payload.data;
      })

      .addCase(verifyOtpAndRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        // This is crucial: OTP sent state remains true so user can try again with a new OTP.
        state.otpError = action.payload.message; // Invalid OTP, Expired etc.
      })

      // 🟦 Get All Profiles
      .addCase(getAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data; // ✅ only profiles array
        state.success = true;
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // 🟩 Get Single Profile by ID
      .addCase(getProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // ✅ single profile
        state.success = true;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // 🔍 Search Profiles
      .addCase(searchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data || [];
        state.success = true;
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.profiles = []; // clear on not found
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
