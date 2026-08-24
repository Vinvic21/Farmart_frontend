import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice';

const CartPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (id, quantity) => {
    if(quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  if(items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add some animals to get started</p>
        <Link to="/browse" className="btn-primary">Browse Animals</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
      {/* CART ITEMS */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        
        <div className="space-y-4">
          {items.map(item => (
            <div key={item._id} className="flex items-center gap-4 border-b pb-4">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 rounded object-cover"/>
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.type} - {item.breed}</p>
                <p className="font-bold text-green-700">KSH {item.price}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >+</button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">KSH {item.price * item.quantity}</p>
                <button 
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-600 text-sm hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-lg shadow p-4 h-fit">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <p>Subtotal ({items.length} items)</p>
          <p>KSH {totalAmount}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Delivery</p>
          <p>To be calculated</p>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <p>Total</p>
          <p>KSH {totalAmount}</p>
        </div>

        <Link to="/checkout" className="btn-primary w-full mt-4 text-center block">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;