import { createSlice } from '@reduxjs/toolkit'

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

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer