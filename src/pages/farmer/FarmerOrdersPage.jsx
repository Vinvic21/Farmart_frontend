import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmerOrders, updateOrderStatus } from '../../features/orders/ordersSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-farmart-green/10 text-farmart-green',
  rejected: 'bg-red-100 text-red-600',
};

function FarmerOrdersPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { farmerOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFarmerOrders(user.id));
    }
  }, [user, dispatch]);

  const handleUpdate = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success(`Order ${status}.`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error('Could not update this order. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading incoming orders..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-semibold mb-2">Couldn't load incoming orders.</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!farmerOrders || farmerOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-gray-500">Orders for your animals will show up here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Incoming Orders</h1>

      <div className="space-y-4">
        {farmerOrders.map((order) => (
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

            {(!order.status || order.status === 'pending') && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleUpdate(order.id, 'confirmed')}
                  className="flex-1 bg-farmart-green text-white rounded-lg py-2 text-sm font-semibold hover:bg-farmart-green/90 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdate(order.id, 'rejected')}
                  className="flex-1 border border-red-300 text-red-600 rounded-lg py-2 text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FarmerOrdersPage;