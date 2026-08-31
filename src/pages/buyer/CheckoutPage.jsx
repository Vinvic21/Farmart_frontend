import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCart, clearCartLocal } from '../../features/cart/cartSlice'
import { checkout } from '../../features/orders/ordersSlice'

export default function CheckoutPage() {
  const { items, totalAmount, status } = useSelector((state) => state.cart)
  const { checkoutStatus, error } = useSelector((state) => state.orders)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    recipient_first_name: '',
    recipient_last_name: '',
    recipient_phone: '',
    delivery_address: '',
    preferred_delivery_date: '',
  })
  const [justOrdered, setJustOrdered] = useState(false)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  useEffect(() => {
    if (!justOrdered && status === 'succeeded' && items.length === 0) {
      navigate('/cart')
    }
  }, [items, status, navigate, justOrdered])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.preferred_delivery_date) delete payload.preferred_delivery_date

    const result = await dispatch(checkout(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      setJustOrdered(true)
      dispatch(clearCartLocal())
      navigate('/order-confirmation', { state: { order: result.payload } })
    }
  }

  if (status === 'loading') return <div className="p-8 text-center text-gray-500">Loading cart...</div>
  if (items.length === 0) return null

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex justify-between mb-2 text-gray-700">
              <span className="capitalize">{item.animal?.breed} {item.animal?.type} x {item.quantity}</span>
              <span>Ksh {item.subtotal?.toLocaleString()}</span>
            </div>
          ))}
          <hr className="my-4 border-gray-100" />
          <div className="flex justify-between font-display font-bold text-xl text-gray-800">
            <span>Total:</span>
            <span className="text-farmart-green-deep">Ksh {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-gray-800 mb-2">Delivery Details</h3>

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" name="recipient_first_name" placeholder="First Name"
              value={form.recipient_first_name} onChange={onChange} required
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
            />
            <input
              type="text" name="recipient_last_name" placeholder="Last Name"
              value={form.recipient_last_name} onChange={onChange} required
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
            />
          </div>
          <input
            type="tel" name="recipient_phone" placeholder="Phone Number (e.g. 2547XXXXXXXX)"
            value={form.recipient_phone} onChange={onChange} required
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
          />
          <input
            type="text" name="delivery_address" placeholder="Delivery Address"
            value={form.delivery_address} onChange={onChange} required
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
          />
          <div>
            <label className="block text-sm text-gray-600 mb-1">Preferred Delivery Date (optional)</label>
            <input
              type="date" name="preferred_delivery_date"
              value={form.preferred_delivery_date} onChange={onChange}
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
            />
          </div>

          <button
            type="submit"
            disabled={checkoutStatus === 'loading'}
            className="bg-farmart-green-deep hover:bg-farmart-green-deep/90 text-white w-full py-3 rounded-lg font-bold text-lg disabled:opacity-60 transition-colors"
          >
            {checkoutStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            The farmer confirms your order first — you'll pay via M-Pesa from your Order History once confirmed.
          </p>
        </form>
      </div>
    </div>
  )
}