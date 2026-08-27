import { Link, useLocation, Navigate } from 'react-router-dom';

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' };

function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  // No order in state means the page was visited directly, not after a
  // real checkout 
  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 sm:p-10 h-fit">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-farmart-green/10 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-farmart-green text-white flex items-center justify-center text-xl sm:text-2xl">
              ✓
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-center text-sm sm:text-base mb-8">
          Thank you for your purchase. The farmer(s) will confirm your order shortly.
        </p>

        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Order Number</span>
            <span className="font-bold text-farmart-green">#{order.order_number || order.id}</span>
          </div>

          <div className="px-4 sm:px-6 divide-y divide-gray-100">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                  {TYPE_EMOJI[(item.animal?.type || '').toLowerCase()] || '🐾'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base capitalize">
                    {item.animal?.breed} {item.animal?.type}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Ksh {(item.price_at_purchase * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg text-farmart-green">Ksh {order.total_amount?.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link
            to="/orders"
            className="order-2 sm:order-1 text-center px-8 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            View Order
          </Link>
          <Link
            to="/browse"
            className="order-1 sm:order-2 text-center px-8 py-3 bg-farmart-green text-white rounded-lg text-sm font-semibold hover:bg-farmart-green/90 transition-colors"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;