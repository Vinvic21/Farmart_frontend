import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import APIClient from '../../services/apiClient'

// The backend owns the cart (it's tied to the logged-in buyer), so all of
// these hit real endpoints instead of just mutating local state.

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
  async ({ animalId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      await APIClient.post('/cart/items', { animal_id: animalId, quantity })
      // Re-fetch so we get the full cart with subtotal/total_amount computed server-side.
      return dispatch(fetchCart()).unwrap()
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to add item to cart')
    }
  }
)

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await APIClient.patch(`/cart/items/${itemId}`, { quantity })
      return dispatch(fetchCart()).unwrap()
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update quantity')
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await APIClient.delete(`/cart/items/${itemId}`)
      return dispatch(fetchCart()).unwrap()
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
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
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
    clearCartLocal: (state) => {
      state.id = null
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        applyCart(state, action.payload)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeCartItem.fulfilled, (state, action) => applyCart(state, action.payload))
  },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer