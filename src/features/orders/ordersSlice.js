import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIClient from '../../services/apiClient';

export const fetchBuyerOrders = createAsyncThunk('orders/fetchBuyerOrders', async (buyerId) => {
  const res = await APIClient.get(`/orders/buyer/${buyerId}`);
  return res.data;
});

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData) => {
  const res = await APIClient.post('/orders', orderData);
  return res.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyerOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchBuyerOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state) => { state.loading = false; })
  }
});

export default ordersSlice.reducer;