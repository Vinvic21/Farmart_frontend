import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminAnimals,
  verifyUser,
  deleteUser,
  deleteAnimalAsAdmin,
  fetchFarmerRevenue,
  fetchFarmerRevenueDetail,
  clearSelectedFarmerRevenue,
} from '../../features/admin/adminSlice'

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔', pig: '🐖' }

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'animals', label: 'Animals' },
  { key: 'revenue', label: 'Farmer Payouts' },
]

const ROLE_FILTERS = [
  { key: '', label: 'All' },
  { key: 'farmer', label: 'Farmers' },
  { key: 'buyer', label: 'Buyers' },
  { key: 'admin', label: 'Admins' },
]

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { stats, users, animals, loading, revenue, revenueLoading, selectedFarmerRevenue } = useSelector(
    (state) => state.admin
  )

  const [activeTab, setActiveTab] = useState('overview')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAdminStats())
    dispatch(fetchAdminUsers())
    dispatch(fetchAdminAnimals())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAdminUsers(roleFilter || undefined))
  }, [dispatch, roleFilter])

  useEffect(() => {
    if (activeTab === 'revenue') {
      dispatch(fetchFarmerRevenue())
      // Payments can complete a few seconds after being initiated, so keep
      // this tab reasonably fresh while it's open rather than requiring a
      // manual tab switch to see updated numbers.
      const interval = setInterval(() => dispatch(fetchFarmerRevenue()), 8000)
      return () => clearInterval(interval)
    }
  }, [dispatch, activeTab])

  const handleVerify = (userId, currentStatus) => {
    const nextStatus = currentStatus === 'verified' ? 'pending' : 'verified'
    dispatch(verifyUser({ userId, status: nextStatus }))
  }

  const handleDeleteUser = (targetUser) => {
    if (!window.confirm(`Delete ${targetUser.email}? This cannot be undone.`)) return
    dispatch(deleteUser(targetUser.id))
  }

  const handleDeleteAnimal = (animal) => {
    if (!window.confirm(`Remove this ${animal.breed} ${animal.type} listing?`)) return
    dispatch(deleteAnimalAsAdmin(animal.id))
  }

  const handleSelectFarmer = (farmerId) => {
    dispatch(fetchFarmerRevenueDetail(farmerId))
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin'

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:sticky md:top-24">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-gray-800">Admin Portal</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5">Manage the marketplace</p>

            <nav className="space-y-1 text-sm font-medium">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    activeTab === tab.key
                      ? 'bg-farmart-green/10 text-farmart-green-deep'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <h1 className="font-display text-3xl font-bold text-gray-800">
            Welcome back, {displayName}
          </h1>
          <p className="text-gray-500 mt-1 mb-6">Here&rsquo;s an overview of the Farmart marketplace.</p>

          {/* Stat cards - always visible */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats?.total_users ?? '—'} />
            <StatCard label="Farmers" value={stats?.total_farmers ?? '—'} />
            <StatCard label="Buyers" value={stats?.total_buyers ?? '—'} />
            <StatCard
              label="Pending Verifications"
              value={stats?.pending_verifications ?? '—'}
              highlight={stats?.pending_verifications > 0}
            />
            <StatCard label="Total Animals" value={stats?.total_animals ?? '—'} />
            <StatCard label="Available Animals" value={stats?.available_animals ?? '—'} />
            <StatCard label="Total Orders" value={stats?.total_orders ?? '—'} />
            <StatCard
              label="Total Revenue"
              value={stats ? `Ksh ${stats.total_revenue.toLocaleString()}` : '—'}
            />
          </div>

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
                <h2 className="font-display font-bold text-gray-800">Users</h2>
                <div className="flex gap-1.5">
                  {ROLE_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setRoleFilter(f.key)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                        roleFilter === f.key
                          ? 'bg-farmart-green text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <p className="text-gray-500 text-sm px-5 py-8 text-center">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-sm px-5 py-8 text-center">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 font-medium">Location</th>
                        <th className="px-5 py-3 font-medium">Verification</th>
                        <th className="px-5 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-5 py-3 text-gray-800">{u.name || '—'}</td>
                          <td className="px-5 py-3 text-gray-800">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{u.profile?.location || '—'}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                u.profile?.verification_status === 'verified'
                                  ? 'bg-farmart-green/10 text-farmart-green-deep'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {u.profile?.verification_status || 'n/a'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2 justify-end">
                              {u.profile && (
                                <button
                                  onClick={() => handleVerify(u.id, u.profile.verification_status)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                >
                                  {u.profile.verification_status === 'verified' ? 'Unverify' : 'Verify'}
                                </button>
                              )}
                              {u.id !== user?.id && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'animals' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-gray-800">All Listings</h2>
                <span className="text-sm text-gray-500">{animals.length} animals</span>
              </div>

              {animals.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-gray-500">
                  No animals listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {animals.map((animal) => (
                    <div
                      key={animal.id}
                      className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-full h-36 bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-6xl overflow-hidden">
                        {animal.image_url ? (
                          <img
                            src={animal.image_url}
                            alt={animal.breed}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                          />
                        ) : null}
                        <span style={animal.image_url ? { display: 'none' } : undefined}>
                          {TYPE_EMOJI[(animal.type || '').toLowerCase()] || '🐾'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold capitalize text-gray-800">
                          {animal.breed} {animal.type}
                        </h3>
                        <p className="text-farmart-green-deep font-semibold mt-1">
                          Ksh {animal.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          Listed by {animal.farmer?.name || 'unknown farmer'}
                        </p>
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize mt-2">
                          {animal.status}
                        </span>
                        <div className="mt-3">
                          <button
                            onClick={() => handleDeleteAnimal(animal)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                          >
                            Remove Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'revenue' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-gray-800">Farmer Payouts</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    Total owed: Ksh {revenue.total_revenue?.toLocaleString() ?? 0}
                  </span>
                  <button
                    onClick={() => dispatch(fetchFarmerRevenue())}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                All buyer payments currently land in one shared M-Pesa account. Use this to see how much
                of that money belongs to each farmer before dispersing payouts.
              </p>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {revenueLoading ? (
                  <p className="text-gray-500 text-sm px-5 py-8 text-center">Loading revenue...</p>
                ) : revenue.farmers.length === 0 ? (
                  <p className="text-gray-500 text-sm px-5 py-8 text-center">No paid orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                          <th className="px-5 py-3 font-medium">Farmer</th>
                          <th className="px-5 py-3 font-medium">Email</th>
                          <th className="px-5 py-3 font-medium">Paid Orders</th>
                          <th className="px-5 py-3 font-medium">Amount Owed</th>
                          <th className="px-5 py-3 font-medium text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenue.farmers.map((f) => (
                          <tr key={f.farmer_id} className="border-b border-gray-50 last:border-0">
                            <td className="px-5 py-3 text-gray-800">{f.name || '—'}</td>
                            <td className="px-5 py-3 text-gray-600">{f.email}</td>
                            <td className="px-5 py-3 text-gray-600">{f.paid_orders}</td>
                            <td className="px-5 py-3 font-semibold text-farmart-green-deep">
                              Ksh {f.total_revenue.toLocaleString()}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => handleSelectFarmer(f.farmer_id)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                              >
                                View orders
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {selectedFarmerRevenue && (
                <div
                  className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                  onClick={() => dispatch(clearSelectedFarmerRevenue())}
                >
                  <div
                    className="bg-white rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
                      <div>
                        <h3 className="font-display font-bold text-gray-800">
                          {selectedFarmerRevenue.farmer?.name || 'Farmer'}
                        </h3>
                        <p className="text-xs text-gray-500">{selectedFarmerRevenue.farmer?.email}</p>
                      </div>
                      <button
                        onClick={() => dispatch(clearSelectedFarmerRevenue())}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-3">
                        Total owed:{' '}
                        <span className="font-semibold text-farmart-green-deep">
                          Ksh {selectedFarmerRevenue.total_revenue.toLocaleString()}
                        </span>
                      </p>
                      {selectedFarmerRevenue.orders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No paid orders for this farmer yet.</p>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {selectedFarmerRevenue.orders.map((o, idx) => (
                            <div key={idx} className="py-3 flex justify-between items-center text-sm">
                              <div>
                                <p className="text-gray-800 capitalize">{o.animal || 'Animal'}</p>
                                <p className="text-xs text-gray-400">
                                  Order #{o.order_number || o.order_id} · Qty {o.quantity}
                                  {o.date ? ` · ${new Date(o.date).toLocaleDateString()}` : ''}
                                </p>
                              </div>
                              <span className="font-semibold text-gray-700">
                                Ksh {o.subtotal.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, highlight }) => (
  <div className={`bg-white rounded-xl border shadow-sm p-5 ${highlight ? 'border-amber-200' : 'border-gray-100'}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-display text-2xl font-bold text-gray-800 mt-2">{value}</p>
    {highlight && <p className="text-xs text-amber-600 font-medium mt-1">Requires attention</p>}
  </div>
)

export default AdminDashboard