import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from "../../features/orders/ordersSlice";
import { clearCart } from "../../features/cart/cartSlice";

const CheckoutPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: '', phone: '', paymentMethod: 'M-Pesa' });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if(!user) return alert('Please login');
    setLoading(true);
    const orderData = {
      buyer: user._id,
      items: items.map(i => ({ animal: i._id, quantity: i.quantity, price: i.price })),
      totalAmount,
      shippingAddress: form.address,
      phone: form.phone,
      paymentMethod: form.paymentMethod
    };
    
    const result = await dispatch(createOrder(orderData));
    if(result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      alert('Order placed successfully!');
      navigate('/buyer/dashboard');
    } else {
      alert(result.payload || 'Failed to place order');
    }
    setLoading(false);
  };

  if(items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/browse" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
        <input placeholder="Delivery Address" className="border p-2 mb-3 w-full rounded" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required/>
        <input placeholder="Phone Number" type="tel" className="border p-2 mb-3 w-full rounded" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required/>
        <select className="border p-2 mb-4 w-full rounded" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
          <option>M-Pesa</option>
          <option>Cash on Delivery</option>
        </select>
        <button type="submit" disabled={loading} className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Placing Order...' : `Place Order - KSH ${totalAmount}`}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {items.map(item => (
          <div key={item._id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">KSH {item.price * item.quantity}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
          <p>Total</p><p>KSH {totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;