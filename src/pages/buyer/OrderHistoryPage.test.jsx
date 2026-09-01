import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { vi } from 'vitest'
import APIClient from '../../services/apiClient'
import ordersReducer from '../../features/orders/ordersSlice'
import OrderHistoryPage from './OrderHistoryPage'

describe('OrderHistoryPage', () => {
  test('shows pending buyer orders as ready for payment instead of waiting for farmer confirmation', async () => {
    vi.spyOn(APIClient, 'get').mockResolvedValue({
      data: {
        orders: [
          {
            id: 101,
            order_number: 'ORD-101',
            status: 'pending',
            total_amount: 25000,
            created_at: '2026-01-02T10:00:00Z',
            items: [
              {
                id: 1,
                quantity: 1,
                status: 'pending',
                price_at_purchase: 25000,
                animal: {
                  type: 'cow',
                  breed: 'Friesian',
                  image_url: '',
                },
              },
            ],
          },
        ],
      },
    })

    const store = configureStore({
      reducer: { orders: ordersReducer },
      preloadedState: {
        orders: {
          orders: [],
          loading: false,
          error: null,
          checkoutStatus: 'idle',
          lastOrder: null,
        },
      },
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrderHistoryPage />
        </BrowserRouter>
      </Provider>
    )

    expect(await screen.findByText(/Order #ORD-101/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pay with M-Pesa/i })).toBeInTheDocument()
    expect(screen.queryByText(/Waiting for farmer confirmation/i)).not.toBeInTheDocument()
  })
})
