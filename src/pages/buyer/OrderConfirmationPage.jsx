import { Link } from 'react-router-dom'

export default function OrderConfirmationPage() {
  return (
    <div className="text-center p-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-4xl font-bold text-green-600 mb-4">Order Placed!</h2>
      <p className="text-gray-600 mb-6">Thank you for shopping with Farmart</p>
      <Link to="/browse" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Continue Shopping
      </Link>
    </div>
  )
}