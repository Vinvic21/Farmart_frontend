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

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    updateStatus: 'idle',
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null
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
  },
})

export const { clearProfileError } = userProfileSlice.actions
export default userProfileSlice.reducer
