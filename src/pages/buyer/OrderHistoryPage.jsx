import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBuyerOrders } from '../../features/orders/ordersSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-farmart-green/10 text-farmart-green',
  rejected: 'bg-red-100 text-red-600',
};

function OrderHistoryPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBuyerOrders(user.id));
    }
  }, [user, dispatch]);

  if (loading) {
    return <LoadingSpinner label="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-semibold mb-2">Couldn't load your orders.</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">Once you place an order, it'll show up here.</p>
        <Link to="/browse" className="text-farmart-green font-medium">
          Browse animals →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm">Order #{order.id}</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {order.status || 'pending'}
              </span>
            </div>

            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                  {item.quantity} × {item.name || item.breed || 'Item'}
                </span>
                <span>${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}

            {order.total != null && (
              <div className="flex justify-between font-semibold text-sm mt-3 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-farmart-green">${order.total.toLocaleString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;