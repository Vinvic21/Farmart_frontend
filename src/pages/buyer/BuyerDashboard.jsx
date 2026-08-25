import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBuyerOrders } from '../../features/orders/ordersSlice';

const BuyerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if(user) {
      dispatch(fetchBuyerOrders(user._id));
    }
  }, [dispatch, user]);

  if(loading) return <div className="p-6">Loading your orders...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <Link to="/browse" className="btn-primary">Browse Animals</Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You have no orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t pt-3 space-y-2">
                {order.items.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.animal?.image || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded object-cover"/>
                    <div className="flex-1">
                      <p className="font-medium">{item.animal?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x KSH {item.price}</p>
                    </div>
                    <p className="font-semibold">KSH {item.quantity * item.price}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <p>Total</p>
                <p>KSH {order.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;