import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../features/cart/cartSlice' // FIXED PATH

export default function CheckoutPage() {
  const { items, total } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlePlaceOrder = () => {
    alert(`Order placed! Total: Ksh ${total.toLocaleString()}`)
    dispatch(clearCart())
    navigate('/order-confirmation')
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        {items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>Ksh {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <hr className="my-4"/>
        <div className="flex justify-between font-bold text-xl">
          <span>Total:</span>
          <span>Ksh {total.toLocaleString()}</span>
        </div>
      </div>
      <button 
        onClick={handlePlaceOrder} 
        className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold text-lg"
      >
        Place Order
      </button>
    </div>
  )
}