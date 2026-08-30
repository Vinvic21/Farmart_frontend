import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIClient from '../../services/apiClient';

// GET /admin/stats — dashboard summary counts (users, animals, orders, revenue)
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/admin/stats');
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
  }
});

// GET /admin/users?role= — all users, optionally filtered by role
export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (role, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/admin/users', { params: role ? { role } : {} });
    return res.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load users');
  }
});

// GET /admin/animals — every animal regardless of status, for moderation
export const fetchAdminAnimals = createAsyncThunk('admin/fetchAnimals', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/admin/animals', { params: { per_page: 50 } });
    return res.data.animals;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load animals');
  }
});

// PATCH /admin/users/:id/verify
export const verifyUser = createAsyncThunk('admin/verifyUser', async ({ userId, status }, { rejectWithValue }) => {
  try {
    const res = await APIClient.patch(`/admin/users/${userId}/verify`, { verification_status: status });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update verification status');
  }
});

// DELETE /admin/users/:id
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await APIClient.delete(`/admin/users/${userId}`);
    return userId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});

// DELETE /admin/animals/:id
export const deleteAnimalAsAdmin = createAsyncThunk('admin/deleteAnimal', async (animalId, { rejectWithValue }) => {
  try {
    await APIClient.delete(`/admin/animals/${animalId}`);
    return animalId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete animal');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    animals: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminAnimals.fulfilled, (state, action) => {
        state.animals = action.payload;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteAnimalAsAdmin.fulfilled, (state, action) => {
        state.animals = state.animals.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;