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

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const persistCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const initialItems = loadCartFromStorage()

const initialState = {
  items: initialItems,
  total: calculateTotal(initialItems)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
      state.total += item.price
      persistCart(state.items)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        state.total -= item.price * item.quantity
        item.quantity = quantity
        state.total += item.price * item.quantity
      }
      persistCart(state.items)
    },
    removeFromCart: (state, action) => {
      const id = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        state.total -= item.price * item.quantity
        state.items = state.items.filter(i => i.id !== id)
      }
      persistCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      persistCart(state.items)
    }
  }
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer