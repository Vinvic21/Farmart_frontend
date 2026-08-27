// import { useSelector, useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { clearCart } from '../../features/cart/cartSlice' // FIXED PATH

// export default function CheckoutPage() {
//   const { items, total } = useSelector((state) => state.cart)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handlePlaceOrder = () => {
//     alert(`Order placed! Total: Ksh ${total.toLocaleString()}`)
//     dispatch(clearCart())
//     navigate('/order-confirmation')
//   }

//   if (items.length === 0) {
//     navigate('/cart')
//     return null
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-8">
//       <h2 className="text-3xl font-bold mb-6">Checkout</h2>
//       <div className="bg-white p-6 rounded shadow mb-6">
//         {items.map(item => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>{item.name} x {item.quantity}</span>
//             <span>Ksh {(item.price * item.quantity).toLocaleString()}</span>
//           </div>
//         ))}
//         <hr className="my-4"/>
//         <div className="flex justify-between font-bold text-xl">
//           <span>Total:</span>
//           <span>Ksh {total.toLocaleString()}</span>
//         </div>
//       </div>
//       <button 
//         onClick={handlePlaceOrder} 
//         className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold text-lg"
//       >
//         Place Order
//       </button>
//     </div>
//   )
// }

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import { createOrder } from '../../features/orders/ordersSlice';

const DELIVERY_FEE = 250;

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    deliveryDate: '',
  });

  const [paymentMethod, setPaymentMethod] = useState(null); // 'mpesa' | 'card' | null
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const updateCard = (field) => (e) => setCard((c) => ({ ...c, [field]: e.target.value }));

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const total = subtotal + DELIVERY_FEE;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.phone || !form.address) {
      toast.error('Please fill in all delivery details.');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      toast.error('Please enter your M-Pesa phone number.');
      return;
    }

    if (paymentMethod === 'card' && (!card.number || !card.expiry || !card.cvv || !card.name)) {
      toast.error('Please fill in all card details.');
    return;
    }

  // Response or error from the backend.
    const orderPayload = {
      buyer_id: user?.id,
      items: cartItems.map((item) => ({
        animal_id: item.id,
        quantity: item.quantity || 1,
      })),
      delivery: {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        address: form.address,
        delivery_date: form.deliveryDate,
      },
      payment_method: paymentMethod,
      total,
    };

    try {
      const result = await dispatch(createOrder(orderPayload)).unwrap();
      dispatch(clearCart());
      toast.success('Payment successful!');
      navigate('/order-confirmation', { state: { order: result } });
    } catch (err) {
      console.error('Order creation failed:', err);
      toast.error('Something went wrong placing your order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some animals to your cart before checking out.</p>
        <Link to="/browse" className="text-farmart-green font-medium">
          ← Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Secure Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8"
      >
        {/* Delivery Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-6">Delivery Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <label className="text-sm">
              <span className="block mb-1.5 font-medium text-gray-700">First Name</span>
              <input
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={update('firstName')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
            <label className="text-sm">
              <span className="block mb-1.5 font-medium text-gray-700">Last Name</span>
              <input
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={update('lastName')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
          </div>

          <label className="text-sm block mb-4">
            <span className="block mb-1.5 font-medium text-gray-700">Phone Number</span>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={update('phone')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
            />
          </label>

          <label className="text-sm block mb-4">
            <span className="block mb-1.5 font-medium text-gray-700">Delivery Address</span>
            <input
              type="text"
              placeholder="123 Farm Lane"
              value={form.address}
              onChange={update('address')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
            />
          </label>

          <label className="text-sm block">
            <span className="block mb-1.5 font-medium text-gray-700">Preferred Delivery Date</span>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={update('deliveryDate')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
            />
          </label>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium">${DELIVERY_FEE.toLocaleString()}.00</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg text-farmart-green">
              ${total.toLocaleString()}.00
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-farmart-green text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:bg-farmart-green/90 transition-colors"
          >
            Place Order →
          </button>

          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            🔒 Secure transaction
          </p>
        </div>
      </form>

      {/* Payment method selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mt-6 lg:mt-8">
        <h2 className="text-xl font-bold mb-6">Payment Method</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('mpesa')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
              paymentMethod === 'mpesa'
                ? 'border-farmart-green bg-farmart-green/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-semibold text-sm">M-Pesa</p>
              <p className="text-xs text-gray-500">Pay via M-Pesa STK Push</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
              paymentMethod === 'card'
                ? 'border-farmart-green bg-farmart-green/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-semibold text-sm">Card</p>
              <p className="text-xs text-gray-500">Pay with debit or credit card</p>
            </div>
          </button>
        </div>

        {paymentMethod === 'mpesa' && (
          <label className="text-sm block max-w-sm">
            <span className="block mb-1.5 font-medium text-gray-700">M-Pesa Phone Number</span>
            <input
              type="tel"
              placeholder="07XX XXX XXX"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
            />
            <span className="block mt-2 text-xs text-gray-400">
              You'll receive a prompt on your phone to complete payment.
            </span>
          </label>
        )}

        {paymentMethod === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <label className="text-sm sm:col-span-2">
              <span className="block mb-1.5 font-medium text-gray-700">Cardholder Name</span>
              <input
                type="text"
                placeholder="John Doe"
                value={card.name}
                onChange={updateCard('name')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="block mb-1.5 font-medium text-gray-700">Card Number</span>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={updateCard('number')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
            <label className="text-sm">
              <span className="block mb-1.5 font-medium text-gray-700">Expiry</span>
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={updateCard('expiry')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
            <label className="text-sm">
              <span className="block mb-1.5 font-medium text-gray-700">CVV</span>
              <input
                type="text"
                placeholder="123"
                value={card.cvv}
                onChange={updateCard('cvv')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green"
              />
            </label>
          </div>
        )}

        {!paymentMethod && (
          <p className="text-sm text-gray-400">Select a payment method above to continue.</p>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;