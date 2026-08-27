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

// BEST GUESS at endpoints — adjust once confirmed against the real backend.
export const fetchFarmerOrders = createAsyncThunk('orders/fetchFarmerOrders', async (farmerId) => {
  const res = await APIClient.get(`/orders/farmer/${farmerId}`);
  return res.data;
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }) => {
    const res = await APIClient.patch(`/orders/${orderId}`, { status });
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    farmerOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyerOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBuyerOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchBuyerOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchFarmerOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFarmerOrders.fulfilled, (state, action) => { state.loading = false; state.farmerOrders = action.payload; })
      .addCase(fetchFarmerOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.farmerOrders = state.farmerOrders.map((o) => (o.id === updated.id ? updated : o));
      });
  },
});

export default ordersSlice.reducer;