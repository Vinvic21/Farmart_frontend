import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if(items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/browse" className="bg-green-600 text-white px-4 py-2 rounded">Browse Animals</Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between border-b py-4">
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p>Ksh {item.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(updateQuantity({id: item.id, quantity: Math.max(1, item.quantity - 1)}))} className="border px-3 py-1">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => dispatch(updateQuantity({id: item.id, quantity: item.quantity + 1}))} className="border px-3 py-1">+</button>
          </div>
          <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500 font-bold">Remove</button>
        </div>
      ))}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold">Total: Ksh {total.toLocaleString()}</h3>
        {/* CHANGED THIS LINE */}
        <Link to="/checkout" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded mt-2 font-bold inline-block">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}