import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const fetchAnimals = createAsyncThunk('animals/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/animals`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending, (state) => { 
        state.loading = true 
        state.error = null
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch animals'
      })
  }
})

export default animalsSlice.reducer