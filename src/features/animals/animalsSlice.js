import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAnimalsRequest, fetchAnimalByIdRequest } from './animalsAPI';

export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await fetchAnimalsRequest(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load animals');
    }
  }
);

export const fetchAnimalById = createAsyncThunk(
  'animals/fetchAnimalById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchAnimalByIdRequest(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load animal');
    }
  }
);

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    list: [],
    listStatus: 'idle', // idle, loading, succeeded, failed
    listError: null,

    current: null,
    detailStatus: 'idle',
    detailError: null,

    filters: { type: '', breed: '', age_min: '', age_max: '', q: '' },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentAnimal(state) {
      state.current = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchAnimals.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload;
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

export const { setFilters, clearCurrentAnimal } = animalsSlice.actions;
export default animalsSlice.reducer;