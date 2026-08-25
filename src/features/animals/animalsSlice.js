import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIClient from '../../services/apiClient';

// Fetch animal list — sends BOTH naming conventions as query params so it
// works whichever the backend actually expects. Unrecognized params are
// typically just ignored by the backend, so this is safe either way.
// once confirmed with backend, trim this down to only the real param names.
export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 12, type = '', species = '', breed = '', ageMin = '', ageMax = '', search = '', q = '' } = filters;

      const params = {};
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (type) { params.type = type; params.species = type; }
      if (species) { params.species = species; params.type = species; }
      if (breed) params.breed = breed;
      if (ageMin) { params.age_min = ageMin; params.ageMin = ageMin; }
      if (ageMax) { params.age_max = ageMax; params.ageMax = ageMax; }
      if (search) { params.q = search; params.search = search; }
      if (q) { params.q = q; params.search = q; }

      const response = await APIClient.get('/animals', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load animals');
    }
  }
);

export const fetchAnimalById = createAsyncThunk(
  'animals/fetchAnimalById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await APIClient.get(`/animals/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load animal');
    }
  }
);

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    list: [],
    listStatus: 'idle', // idle | loading | succeeded | failed
    listError: null,
    currentPage: 1,
    totalPages: 1,

    current: null,
    detailStatus: 'idle',
    detailError: null,

    filters: { type: '', breed: '', ageMin: '', ageMax: '', search: '' },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { type: '', breed: '', ageMin: '', ageMax: '', search: '' };
    },
    clearCurrentAnimal(state) {
      state.current = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list — handles both a plain array response and a paginated
      // { animals, totalPages, currentPage } response
      .addCase(fetchAnimals.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload.animals || action.payload;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload;
      })

      // fetch detail
      .addCase(fetchAnimalById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchAnimalById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchAnimalById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentAnimal } = animalsSlice.actions;
export default animalsSlice.reducer;