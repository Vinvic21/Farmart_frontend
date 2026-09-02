import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import APIClient from '../../services/apiClient';

// GET /orders/ — the backend figures out buyer vs. farmer vs. admin view
// from the JWT, no id needs to be passed in.
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await APIClient.get('/orders/');
    return res.data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
  }
});

// POST /orders/checkout — converts the buyer's cart into an order. Requires
// delivery details; the cart itself is read server-side, not sent by us.
export const checkout = createAsyncThunk('orders/checkout', async (deliveryDetails, { rejectWithValue }) => {
  try {
    const res = await APIClient.post('/orders/checkout', deliveryDetails);
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order');
  }
});



const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false, error: null, checkoutStatus: 'idle', lastOrder: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(checkout.pending, (state) => { state.checkoutStatus = 'loading'; state.error = null; })
      .addCase(checkout.fulfilled, (state, action) => {
        state.checkoutStatus = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.checkoutStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export default ordersSlice.reducer;