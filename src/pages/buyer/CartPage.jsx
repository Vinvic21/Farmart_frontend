import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart, updateCartItemQuantity, removeCartItem } from '../../features/cart/cartSlice'

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' }

export default function CartPage() {
  const { items, totalAmount, status, updatingItemId, removingItemId } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  // Only the very first load (before we have any data at all) shows the
  // full-page loader. Every mutation after that (quantity change, remove)
  // updates state in place — the list itself never unmounts, so nothing
  // "refreshes" from the buyer's point of view.
  if (status === 'loading' && items.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading your cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="bg-farmart-cream min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Browse the marketplace and add an animal to get started.</p>
          <Link to="/browse" className="bg-farmart-green-deep text-white px-6 py-3 rounded-lg font-semibold hover:bg-farmart-green-deep/90 transition-colors inline-block">
            Browse Animals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {items.map(item => {
            const emoji = TYPE_EMOJI[(item.animal?.type || '').toLowerCase()] || '🐾'
            const isUpdating = updatingItemId === item.id
            const isRemoving = removingItemId === item.id
            const rowBusy = isUpdating || isRemoving
            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 transition-opacity ${rowBusy ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="w-full sm:w-20 h-20 rounded-lg bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                  {item.animal?.image_url ? (
                    <img
                      src={item.animal.image_url} alt={item.animal.breed} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span style={item.animal?.image_url ? { display: 'none' } : undefined}>{emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-gray-800 capitalize">{item.animal?.breed} {item.animal?.type}</h3>
                  <p className="text-sm text-gray-500">Ksh {item.animal?.price?.toLocaleString()} each</p>
                </div>

                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    disabled={rowBusy}
                    onClick={() => dispatch(updateCartItemQuantity({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{isUpdating ? '…' : item.quantity}</span>
                  <button
                    disabled={rowBusy}
                    onClick={() => dispatch(updateCartItemQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <span className="font-display font-bold text-farmart-green-deep w-28 text-right">
                  Ksh {item.subtotal?.toLocaleString()}
                </span>

                <button
                  disabled={rowBusy}
                  onClick={() => dispatch(removeCartItem(item.id))}
                  className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  {isRemoving ? 'Removing…' : 'Remove'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-display text-2xl font-bold text-farmart-green-deep">Ksh {totalAmount.toLocaleString()}</p>
          </div>
          <Link
            to="/checkout"
            className="bg-farmart-amber text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}