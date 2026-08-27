import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIClient from '../../services/apiClient';

// GET /animals — backend supports: type, breed, status, min_price, max_price,
// min_age, max_age, page, per_page. There's no free-text search param, so the
// "search" box is mapped onto `breed`, which the backend matches with ILIKE.
export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, perPage = 12, type = '', breed = '', search = '', minPrice, maxPrice, minAge, maxAge } = filters;

      const params = { page, per_page: perPage };
      if (type) params.type = type;
      if (breed) params.breed = breed;
      if (search) params.breed = search;
      if (minPrice !== undefined && minPrice !== '') params.min_price = minPrice;
      if (maxPrice !== undefined && maxPrice !== '') params.max_price = maxPrice;
      if (minAge !== undefined && minAge !== '') params.min_age = minAge;
      if (maxAge !== undefined && maxAge !== '') params.max_age = maxAge;

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
    total: 0,

    current: null,
    detailStatus: 'idle',
    detailError: null,

    filters: { type: '', search: '' },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { type: '', search: '' };
    },
    clearCurrentAnimal(state) {
      state.current = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET /animals -> { animals, page, per_page, total, pages }
      .addCase(fetchAnimals.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload.animals || [];
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.pages || 1;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload;
      })

      // GET /animals/:id -> the animal object directly
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