import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import APIClient from '../../services/apiClient'

const normalizeUser = (user) => ({ ...user, ...(user?.profile || {}) })

// GET /users/profile — fetch the logged-in user's profile
export const fetchUserProfile = createAsyncThunk('userProfile/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/users/profile')
    return normalizeUser(res.data.user)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile')
  }
})

// PATCH /users/profile — update the logged-in user's profile
export const updateUserProfile = createAsyncThunk('userProfile/update', async (profileData, { rejectWithValue }) => {
  try {
    const res = await APIClient.patch('/users/profile', profileData)
    return normalizeUser(res.data.user)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile')
  }
})

// GET /users/:id — public "view profile" for a farmer/buyer, no login
// required. Returns { user, listings } — listings is populated for
// farmers (their other active animals).
export const fetchPublicProfile = createAsyncThunk('userProfile/fetchPublic', async (userId, { rejectWithValue }) => {
  try {
    const res = await APIClient.get(`/users/${userId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load this profile')
  }
})

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    updateStatus: 'idle',

    publicProfile: null,
    publicListings: [],
    publicLoading: false,
    publicError: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null
    },
    clearPublicProfile: (state) => {
      state.publicProfile = null
      state.publicListings = []
      state.publicError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = 'loading'
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.profile = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.payload
      })
      // Public profile (view someone else's)
      .addCase(fetchPublicProfile.pending, (state) => {
        state.publicLoading = true
        state.publicError = null
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.publicLoading = false
        state.publicProfile = action.payload.user
        state.publicListings = action.payload.listings || []
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.publicLoading = false
        state.publicError = action.payload
      })
  },
})

export const { clearProfileError, clearPublicProfile } = userProfileSlice.actions
export default userProfileSlice.reducer