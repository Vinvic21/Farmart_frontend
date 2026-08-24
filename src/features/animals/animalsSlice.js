import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Thunk with query params for pagination, search, filter
export const fetchAnimals = createAsyncThunk('animals/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 12, search = '', breed = '', ageMin = '', ageMax = '', species = '' } = params
    
    const query = new URLSearchParams()
    query.append('page', page)
    query.append('limit', limit)
    if(search) query.append('search', search)
    if(breed) query.append('breed', breed)
    if(ageMin) query.append('ageMin', ageMin)
    if(ageMax) query.append('ageMax', ageMax)
    if(species) query.append('species', species)

    const res = await axios.get(`${API_URL}/animals?${query.toString()}`)
    return res.data // backend should return { animals: [], totalPages: 5, currentPage: 1 }
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: { search: '', breed: '', ageMin: '', ageMax: '', species: '' }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { search: '', breed: '', ageMin: '', ageMax: '', species: '' }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending, (state) => { 
        state.loading = true 
        state.error = null
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.animals || action.payload // support both formats
        state.currentPage = action.payload.currentPage || 1
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch animals'
      })
  }
})

export const { setFilters, clearFilters } = animalsSlice.actions
export default animalsSlice.reducer