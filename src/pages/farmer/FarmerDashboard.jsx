import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import APIClient from '../../services/apiClient'
import { fetchOrders } from '../../features/orders/ordersSlice'

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' }
const STATUSES = ['available', 'pending', 'sold']
const REVENUE_STATUSES = ['confirmed', 'paid']

const ITEM_STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-farmart-green/10 text-farmart-green-deep',
  paid: 'bg-farmart-green/10 text-farmart-green-deep',
  rejected: 'bg-red-100 text-red-600',
}
const ITEM_STATUS_LABEL = {
  pending: 'Pending Pickup',
  confirmed: 'Completed',
  paid: 'Completed',
  rejected: 'Rejected',
}

const FarmerDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orders } = useSelector((state) => state.orders)
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMyAnimals = async () => {
    try {
      // GET /animals has no "my listings" endpoint and defaults to
      // status=available only, so we pull each status and merge, then
      // keep just the ones this farmer owns.
      const responses = await Promise.all(
        STATUSES.map((status) => APIClient.get('/animals', { params: { status, per_page: 50 } }))
      )
      const all = responses.flatMap((res) => res.data.animals)
      setAnimals(all.filter((a) => a.farmer_id === user.id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyAnimals()
    dispatch(fetchOrders())
  }, [dispatch])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal?')) return
    try {
      await APIClient.delete(`/animals/${id}`)
      setAnimals(animals.filter(a => a.id !== id))
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'Failed to delete animal')
    }
  }

  // Flatten this farmer's line items across every order (an order can span
  // multiple farmers, so we only keep the items that belong to this one).
  const myItems = useMemo(() => {
    return orders.flatMap((order) =>
      (order.items || [])
        .filter((item) => item.farmer_id === user?.id)
        .map((item) => ({
          ...item,
          orderNumber: order.order_number || order.id,
          buyer: `${order.recipient_first_name || ''} ${order.recipient_last_name || ''}`.trim() || 'Buyer',
          date: order.created_at,
        }))
    )
  }, [orders, user])

  const stats = useMemo(() => {
    const pendingOrders = myItems.filter((i) => i.status === 'pending').length
    const totalRevenue = myItems
      .filter((i) => REVENUE_STATUSES.includes(i.status))
      .reduce((sum, i) => sum + (i.price_at_purchase || 0) * (i.quantity || 1), 0)
    return { totalAnimals: animals.length, pendingOrders, totalRevenue }
  }, [myItems, animals])

  const recentActivity = useMemo(() => {
    return [...myItems]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5)
  }, [myItems])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:sticky md:top-24">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-farmart-green text-xl"></span>
              <h2 className="font-display font-bold text-gray-800">Farmer Portal</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5">Manage your livestock</p>

            <Link
              to="/farmer/add-animal"
              className="block text-center bg-farmart-green hover:bg-green-700 text-white font-semibold rounded-lg py-2.5 mb-5 transition"
            >
              + List New Animal
            </Link>

            <nav className="space-y-1 text-sm font-medium">
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-farmart-green/10 text-farmart-green-deep">
                 Dashboard
              </span>
              <a href="#my-animals" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                 My Animals
              </a>
              <Link to="/farmer/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                 Orders
              </Link>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed">
                 Settings
              </span>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <h1 className="font-display text-3xl font-bold text-gray-800">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-500 mt-1 mb-6">Here&rsquo;s what&rsquo;s happening on your farm today.</p>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Animals Listed</p>
                <span className="text-farmart-green"></span>
              </div>
              <p className="font-display text-3xl font-bold text-gray-800 mt-2">{stats.totalAnimals}</p>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <span className="text-amber-500"></span>
              </div>
              <p className="font-display text-3xl font-bold text-gray-800 mt-2">{stats.pendingOrders}</p>
              {stats.pendingOrders > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-1">Requires attention</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <span className="text-farmart-green"></span>
              </div>
              <p className="font-display text-3xl font-bold text-gray-800 mt-2">
                Ksh {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-gray-800">Recent Activity</h2>
              <Link to="/farmer/orders" className="text-sm text-farmart-green-deep font-semibold hover:underline">
                View All
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm px-5 py-8 text-center">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="px-5 py-3 font-medium">Item</th>
                      <th className="px-5 py-3 font-medium">Buyer</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{TYPE_EMOJI[(item.animal?.type || '').toLowerCase()] || ''}</span>
                            <span className="capitalize">{item.animal?.breed} {item.animal?.type}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{item.buyer}</td>
                        <td className="px-5 py-3 text-gray-500">
                          {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ITEM_STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
                            {ITEM_STATUS_LABEL[item.status] || item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-800">
                          Ksh {((item.price_at_purchase || 0) * (item.quantity || 1)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My animals */}
          <div id="my-animals">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-gray-800">My Animals</h2>
              <Link to="/farmer/add-animal" className="text-sm font-semibold text-farmart-green-deep hover:underline">
                + Add Animal
              </Link>
            </div>

            {animals.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-gray-500">
                You have no animals listed yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {animals.map(animal => (
                  <div key={animal.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="w-full h-36 bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-6xl overflow-hidden">
                      {animal.image_url ? (
                        <img
                          src={animal.image_url} alt={animal.breed} className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <span style={animal.image_url ? { display: 'none' } : undefined}>
                        {TYPE_EMOJI[(animal.type || '').toLowerCase()] || ''}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold capitalize text-gray-800">{animal.breed} {animal.type}</h3>
                      <p className="text-farmart-green-deep font-semibold mt-1">Ksh {animal.price?.toLocaleString()}</p>
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize mt-2">
                        {animal.status}
                      </span>
                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/farmer/edit-animal/${animal.id}`}
                          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(animal.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default FarmerDashboard