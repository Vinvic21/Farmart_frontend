import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalAmount: 0 },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i._id === action.payload._id);
      if(existing) {
        existing.quantity += 1;
      } else {
        state.items.push({...action.payload, quantity: 1});
      }
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if(item) item.quantity = action.payload.quantity;
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;