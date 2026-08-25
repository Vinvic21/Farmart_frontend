import { useState, useEffect } from 'react'
import axios from 'axios'

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/farmer`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (error) {
      console.log('Error fetching orders:', error)
      alert('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders() // refresh list
      alert(`Order ${status} successfully!`)
    } catch (error) {
      alert('Failed to update order')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading orders...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Incoming Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-200 p-5 rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p><strong>Buyer:</strong> {order.buyer?.name} - {order.buyer?.phone}</p>
                  <p><strong>Animal:</strong> {order.animal?.title} - {order.animal?.breed}</p>
                  <p><strong>Total:</strong> KES {order.total?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}