import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../../features/orders/ordersSlice'

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  paid: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function FarmerOrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) return <div className="p-8 text-center">Loading orders...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Incoming Orders</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            // A single order can span multiple farmers' animals — only show
            // and act on the line items that belong to the logged-in farmer.
            const myItems = (order.items || []).filter((item) => item.farmer_id === user?.id)
            if (myItems.length === 0) return null
            const myStatus = myItems[0]?.status

            return (
              <div key={order.id} className="border border-gray-200 p-5 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">Order #{order.order_number || order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[myStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {myStatus}
                      </span>
                    </div>
                    <p><strong>Deliver to:</strong> {order.recipient_first_name} {order.recipient_last_name} — {order.recipient_phone}</p>
                    <p><strong>Address:</strong> {order.delivery_address}</p>
                    <div className="mt-1">
                      {myItems.map((item) => (
                        <p key={item.id}>
                          <strong>Animal:</strong> {item.animal?.breed} {item.animal?.type} × {item.quantity} — Ksh {(item.price_at_purchase * item.quantity).toLocaleString()}
                        </p>
                      ))}
                    </div>
                    {order.created_at && (
                      <p className="text-sm text-gray-500">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}