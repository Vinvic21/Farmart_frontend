import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import APIClient from '../../services/apiClient'

// Shared by every auth thunk: turns an axios error into a message that
// actually tells the user what happened, instead of collapsing "wrong
// password" and "the server never responded" into one generic string.
function getAuthErrorMessage(err, fallback) {
  if (err.response?.data?.message) {
    // The backend responded — this is a real auth/validation error.
    return err.response.data.message
  }
  if (err.code === 'ECONNABORTED' || !err.response) {
    // No response at all: likely a cold start (Render free tier spins
    // down after ~15 min idle and can take up to a minute to wake back
    // up) or a genuine connectivity issue — not necessarily bad credentials.
    return 'Could not reach the server. It may be waking up after being idle — please wait a few seconds and try again.'
  }
  return fallback
}

// POST /auth/register — creates the user but does NOT log them in
// (the backend returns { success, message, user }, no tokens).
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const res = await APIClient.post('/auth/register', userData)
    return res.data
  } catch (err) {
    return rejectWithValue(getAuthErrorMessage(err, 'Registration failed'))
  }
})

// POST /auth/login — returns { success, message, access_token, refresh_token, user }
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const res = await APIClient.post('/auth/login', userData)
    return res.data
  } catch (err) {
    return rejectWithValue(getAuthErrorMessage(err, 'Login failed'))
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await APIClient.post('/auth/logout')
  } catch {
    // ignore — token may already be expired, we're clearing client state anyway
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
    clearAuthError: (state) => {
      state.error = null
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // register — no tokens come back, so we don't authenticate the user
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.registerSuccess = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.registerSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.access_token)
        localStorage.setItem('refreshToken', action.payload.refresh_token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      })
  },
})

export const { logout, clearAuthError, clearRegisterSuccess } = authSlice.actions
export default authSlice.reducer