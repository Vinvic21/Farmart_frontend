import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import animalsReducer from '../features/animals/animalsSlice';

export const store = configureStore({
  reducer: {
    animals: animalsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
})

export default store;
