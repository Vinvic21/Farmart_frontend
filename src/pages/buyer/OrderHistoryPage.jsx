import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../features/orders/ordersSlice'
import APIClient from '../../services/apiClient'

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' }

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-farmart-green/10 text-farmart-green-deep',
  rejected: 'bg-red-100 text-red-600',
}

function OrderHistoryPage() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)
  const [payingId, setPayingId] = useState(null)
  const [payMessage, setPayMessage] = useState(null)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const handlePayNow = async (orderId) => {
    setPayingId(orderId)
    setPayMessage(null)
    try {
      const res = await APIClient.post('/payments/initiate', { order_id: orderId })
      setPayMessage({ orderId, type: 'success', text: res.data.message || 'Check your phone to complete payment.' })
    } catch (err) {
      setPayMessage({ orderId, type: 'error', text: err.response?.data?.error || 'Failed to start payment' })
    } finally {
      setPayingId(null)
      setTimeout(() => dispatch(fetchOrders()), 4000)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your orders...</div>

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/browse" className="bg-farmart-green-deep text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-farmart-green-deep/90 transition-colors">
              Browse Animals
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-display font-bold text-gray-800">Order #{order.order_number || order.id}</span>
                    {order.created_at && (
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-gray-50 border-y border-gray-50 my-3">
                  {(order.items || []).map((item) => {
                    const emoji = TYPE_EMOJI[(item.animal?.type || '').toLowerCase()] || '🐾'
                    return (
                      <div key={item.id} className="flex items-center gap-3 py-2.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                          {item.animal?.image_url ? (
                            <img
                              src={item.animal.image_url} alt={item.animal.breed} className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <span style={item.animal?.image_url ? { display: 'none' } : undefined}>{emoji}</span>
                        </div>
                        <span className="text-sm text-gray-600 capitalize flex-1">
                          {item.animal?.breed} {item.animal?.type} × {item.quantity}
                        </span>
                        {item.status && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-gray-700">
                    Total: <span className="font-display font-bold text-farmart-green-deep">Ksh {order.total_amount?.toLocaleString()}</span>
                  </p>

                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handlePayNow(order.id)}
                      disabled={payingId === order.id}
                      className="bg-farmart-amber text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60"
                    >
                      {payingId === order.id ? 'Starting M-Pesa...' : 'Pay with M-Pesa'}
                    </button>
                  )}
                  {order.status === 'paid' && (
                    <span className="text-farmart-green-deep font-semibold text-sm">✓ Paid</span>
                  )}
                  {order.status === 'pending' && (
                    <span className="text-gray-400 text-sm">Waiting for farmer confirmation</span>
                  )}
                  {order.status === 'rejected' && (
                    <span className="text-red-500 text-sm">Order was rejected by the farmer</span>
                  )}
                </div>

                {payMessage && payMessage.orderId === order.id && (
                  <p className={`text-sm mt-3 ${payMessage.type === 'success' ? 'text-farmart-green-deep' : 'text-red-600'}`}>
                    {payMessage.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistoryPage