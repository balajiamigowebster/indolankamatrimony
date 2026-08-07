import API from "@/app/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
  loading: false,
  success: false,
  error: null,
  profiles: [], // All profiles list
  profileCount: 0,
  singleProfile: null,
  deleteSuccess: false,
  updateSuccess: false,
};

// =========================================================
// ASYNC THUNKS (API Calls)
// =========================================================

// API 1: GET All Profiles (Admin)
export const adminGetAllProfiles = createAsyncThunk(
  "admin/getAllProfiles",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Search parameter irundhaa, adha query-la anuppalaam

      const { search, gender, maritalStatus } = filters;

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (gender && gender !== "All") params.append("gender", gender);
      if (maritalStatus && maritalStatus !== "All")
        params.append("maritalStatus", maritalStatus);

      //   const endpoint = search
      //     ? `/admin/profiles?search=${encodeURIComponent(search)}`
      //     : "/admin/profiles";

      const endpoint = `/admin/profiles?${params.toString()}`;

      const res = await API.get(endpoint);

      // Backend response structure: { data: profiles[] }

      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profiles" }
      );
    }
  }
);

// API 2: GET Profile by ID (Admin)
export const adminGetProfileById = createAsyncThunk(
  "admin/getProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/admin/profiles/${id}`);
      // Backend response structure: { data: profile }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profile details" }
      );
    }
  }
);

// API 3: UPDATE Profile by ID (Admin)
// updateData is FormData object

export const adminUpdateProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      // Form-Data anuppurathala, headers-a specify pannanum

      const res = await API.put(`/admin/profiles/${id}`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Backend response structure: { data: updatedProfile }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);

// API 4: DELETE Profile by ID (Admin)
export const adminDeleteProfile = createAsyncThunk(
  "admin/deleteProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/admin/profiles/${id}`);
      // Backend response structure: { message: string }
      console.log(res.data);
      return { id, ...res.data }; // Deleted ID-a state-la remove panna return pannuvom
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete profile" }
      );
    }
  }
);

// =========================================================
// SLICE DEFINITION
// =========================================================

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminGetAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
        state.updateSuccess = false;
      })
      .addCase(adminGetAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data || [];
        state.profileCount = action.payload.count || action.payload.data.length; // Count update
        state.success = true;
      })
      .addCase(adminGetAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.profiles = []; // Clear profiles on error (e.g., No profiles found)
        state.profileCount = 0; // Count reset
      })

      // ------------------------------------
      // 2. GET SINGLE PROFILE BY ID
      // ------------------------------------

      .addCase(adminGetProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleProfile = null; // Clear previous data
      })

      .addCase(adminGetProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProfile = action.payload.data; // Single profile object-a save pannum
        state.success = true;
      })
      .addCase(adminGetProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.singleProfile = null;
      })

      // ------------------------------------
      // 3. UPDATE PROFILE
      // ------------------------------------

      .addCase(adminUpdateProfile.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(adminUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.singleProfile = action.payload.data; // Updated profile-a save pannum
        state.success = true; // General success flag

        // Update the profile in the profiles list
        const updatedProfile = action.payload.data;
        const index = state.profiles.findIndex(
          (p) => p.id === updatedProfile.id
        );
        if (index !== -1) {
          state.profiles[index] = updatedProfile;
        }
      })
      .addCase(adminUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.error = action.payload.message;
      })
      // ------------------------------------
      // 4. DELETE PROFILE
      // ------------------------------------
      .addCase(adminDeleteProfile.pending, (state) => {
        state.loading = true;
        state.deleteSuccess = false;
        state.error = null;
      })
      .addCase(adminDeleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.success = true;

        // Deleted profile-a profiles list-la irundhu filter panni remove pannalaam
        state.profiles = state.profiles.filter(
          (profile) => profile.id !== action.payload.id
        );
      })
      .addCase(adminDeleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.deleteSuccess = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
