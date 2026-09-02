import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import APIClient from '../../services/apiClient'

// The backend owns the cart (logged-in buyer). fetchCart is the only thunk
// that should ever flip `status` to 'loading' — it's used for the true
// first load. Mutations (add/update/remove) fetch the fresh cart directly
// (not via dispatch(fetchCart())) and apply it silently, so an in-flight
// mutation never blanks out the cart UI the buyer is already looking at.

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/cart')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to load cart')
  }
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ animalId, quantity = 1 }, { rejectWithValue }) => {
    try {
      await APIClient.post('/cart/items', { animal_id: animalId, quantity })
      const res = await APIClient.get('/cart')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to add item to cart')
    }
  }
)

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      await APIClient.patch(`/cart/items/${itemId}`, { quantity })
      const res = await APIClient.get('/cart')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update quantity')
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await APIClient.delete(`/cart/items/${itemId}`)
      const res = await APIClient.get('/cart')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to remove item')
    }
  }
)

const initialState = {
  id: null,
  items: [], // [{ id, animal_id, quantity, subtotal, animal }]
  totalItems: 0,
  totalAmount: 0,
  status: 'idle', // idle | loading | succeeded | failed — only fetchCart touches this
  error: null,
  // Per-item mutation tracking, so the UI can show a subtle inline
  // indicator on just the row being changed instead of a full reload.
  updatingItemId: null,
  removingItemId: null,
  adding: false,
}

const applyCart = (state, cart) => {
  state.id = cart.id
  state.items = cart.items || []
  state.totalItems = cart.total_items || 0
  state.totalAmount = cart.total_amount || 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Resets local view only — used right after a successful checkout,
    // since the backend has already cleared the cart server-side.
    clearCartLocal: (state) => {
      state.id = null
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'succeeded'; applyCart(state, action.payload) })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })

      .addCase(addToCart.pending, (state) => { state.adding = true; state.error = null })
      .addCase(addToCart.fulfilled, (state, action) => { state.adding = false; applyCart(state, action.payload) })
      .addCase(addToCart.rejected, (state, action) => { state.adding = false; state.error = action.payload })

      .addCase(updateCartItemQuantity.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.itemId
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.updatingItemId = null
        applyCart(state, action.payload)
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.updatingItemId = null
        state.error = action.payload
      })

      .addCase(removeCartItem.pending, (state, action) => {
        state.removingItemId = action.meta.arg
        state.error = null
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removingItemId = null
        applyCart(state, action.payload)
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removingItemId = null
        state.error = action.payload
      })
  },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer