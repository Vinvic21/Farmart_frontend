import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import animalsReducer from '../features/animals/animalsSlice'
import ordersReducer from '../features/orders/ordersSlice'
import adminReducer from '../features/admin/adminSlice'
import userProfileReducer from '../features/user/userProfileSlice'

export const store = configureStore({
  reducer: {
    animals: animalsReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    admin: adminReducer,
    userProfile: userProfileReducer,
  },
})

export default store