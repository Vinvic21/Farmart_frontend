import { configureStore } from '@reduxjs/toolkit';
import animalsReducer from '../features/animals/animalsSlice';


const store = configureStore({
  reducer: {
    animals: animalsReducer,
  },
});

export default store;
