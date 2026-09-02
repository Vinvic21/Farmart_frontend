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

// GET /admin/revenue — total revenue owed to each farmer, for payouts
export const fetchFarmerRevenue = createAsyncThunk('admin/fetchFarmerRevenue', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/admin/revenue');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load revenue');
  }
});

// GET /admin/revenue/:farmerId — line-item breakdown for one farmer
export const fetchFarmerRevenueDetail = createAsyncThunk(
  'admin/fetchFarmerRevenueDetail',
  async (farmerId, { rejectWithValue }) => {
    try {
      const res = await APIClient.get(`/admin/revenue/${farmerId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load farmer revenue');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    animals: [],
    revenue: { total_revenue: 0, farmers: [] },
    selectedFarmerRevenue: null,
    loading: false,
    revenueLoading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSelectedFarmerRevenue: (state) => {
      state.selectedFarmerRevenue = null;
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
        const previousStatus = idx !== -1 ? state.users[idx].profile?.verification_status : null;
        if (idx !== -1) state.users[idx] = action.payload;

        // Keep the "Pending Verifications" stat card in sync instantly,
        // instead of waiting on a manual refresh / stats refetch.
        if (state.stats && previousStatus !== action.payload.profile?.verification_status) {
          if (action.payload.profile?.verification_status === 'verified' && previousStatus !== 'verified') {
            state.stats.pending_verifications = Math.max(0, (state.stats.pending_verifications || 0) - 1);
          } else if (previousStatus === 'verified' && action.payload.profile?.verification_status !== 'verified') {
            state.stats.pending_verifications = (state.stats.pending_verifications || 0) + 1;
          }
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUser = state.users.find((u) => u.id === action.payload);
        state.users = state.users.filter((u) => u.id !== action.payload);

        // Same idea for the top-level user/role counts — decrement locally
        // so the dashboard reflects the delete right away.
        if (state.stats && deletedUser) {
          state.stats.total_users = Math.max(0, (state.stats.total_users || 0) - 1);
          if (deletedUser.role === 'farmer') {
            state.stats.total_farmers = Math.max(0, (state.stats.total_farmers || 0) - 1);
          } else if (deletedUser.role === 'buyer') {
            state.stats.total_buyers = Math.max(0, (state.stats.total_buyers || 0) - 1);
          }
          if (deletedUser.profile?.verification_status === 'pending') {
            state.stats.pending_verifications = Math.max(0, (state.stats.pending_verifications || 0) - 1);
          }
        }
      })
      .addCase(deleteAnimalAsAdmin.fulfilled, (state, action) => {
        const deletedAnimal = state.animals.find((a) => a.id === action.payload);
        state.animals = state.animals.filter((a) => a.id !== action.payload);
        if (state.stats && deletedAnimal) {
          state.stats.total_animals = Math.max(0, (state.stats.total_animals || 0) - 1);
          if (deletedAnimal.status === 'available') {
            state.stats.available_animals = Math.max(0, (state.stats.available_animals || 0) - 1);
          }
        }
      })
      .addCase(fetchFarmerRevenue.pending, (state) => {
        state.revenueLoading = true;
      })
      .addCase(fetchFarmerRevenue.fulfilled, (state, action) => {
        state.revenueLoading = false;
        state.revenue = { total_revenue: action.payload.total_revenue, farmers: action.payload.farmers };
      })
      .addCase(fetchFarmerRevenue.rejected, (state, action) => {
        state.revenueLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFarmerRevenueDetail.fulfilled, (state, action) => {
        state.selectedFarmerRevenue = action.payload;
      });
  },
});

export const { clearAdminError, clearSelectedFarmerRevenue } = adminSlice.actions;
export default adminSlice.reducer;