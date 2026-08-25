import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0
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
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        state.total -= item.price * item.quantity
        item.quantity = quantity
        state.total += item.price * item.quantity
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        state.total -= item.price * item.quantity
        state.items = state.items.filter(i => i.id !== id)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    }
  }
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer