import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    items: JSON.parse(localStorage.getItem('cart')) || [] 
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if(existing) {
        existing.quantity += 1
      } else {
        state.items.push({...action.payload, quantity: 1})
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => { // <- ADD THIS
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => { // bonus: for +/- buttons
      const item = state.items.find(item => item.id === action.payload.id)
      if(item) {
        item.quantity = action.payload.quantity
        if(item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id)
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => { // bonus: for checkout
      state.items = []
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer