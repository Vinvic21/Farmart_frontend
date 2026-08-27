import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimalById, clearCurrentAnimal } from '../../features/animals/animalsSlice';
import { addToCart } from '../../features/cart/cartSlice';

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' };

const STATUS_STYLES = {
  available: 'bg-farmart-green/10 text-farmart-green-deep',
  pending: 'bg-amber-100 text-amber-700',
  sold: 'bg-gray-200 text-gray-600',
};

function AnimalDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: animal, detailStatus, detailError } = useSelector((state) => state.animals);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchAnimalById(id));
    return () => {
      dispatch(clearCurrentAnimal());
    };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const result = await dispatch(addToCart({ animalId: animal.id, quantity }));
    if (result.meta.requestStatus === 'fulfilled') {
      alert(`${animal.breed} ${animal.type} added to cart!`);
    } else {
      alert(result.payload || 'Failed to add to cart');
    }
  };

  if (detailStatus === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading animal details...
      </div>
    );
  }

  if (detailStatus === 'failed') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-semibold mb-2">Couldn't load this animal.</p>
        <p className="text-gray-500 text-sm mb-6">{detailError}</p>
        <Link to="/browse" className="text-farmart-green-deep font-medium">
          ← Back to browse
        </Link>
      </div>
    );
  }

  if (!animal) return null;

  const emoji = TYPE_EMOJI[(animal.type || '').toLowerCase()] || '🐾';
  const isAvailable = animal.status === 'available';

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/browse" className="text-sm text-gray-500 hover:text-farmart-green-deep mb-6 inline-block">
          ← Back to browse
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: photo + about */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <span
                className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full capitalize z-10 ${
                  STATUS_STYLES[animal.status] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {animal.status || 'available'}
              </span>
              <div className="w-full h-72 sm:h-96 bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-[10rem] overflow-hidden">
                {animal.image_url ? (
                  <img
                    src={animal.image_url}
                    alt={`${animal.breed} ${animal.type}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <span style={animal.image_url ? { display: 'none' } : undefined}>{emoji}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-lg text-gray-800 mb-3">About This Animal</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {animal.description || "The seller hasn't added a description for this animal yet."}
              </p>
            </div>
          </div>

          {/* Right: purchase card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit lg:sticky lg:top-24">
            <h1 className="font-display text-2xl font-bold text-gray-800 capitalize">
              {animal.breed} {animal.type}
            </h1>
            {animal.farmer?.email && (
              <p className="text-gray-500 text-sm mt-1">Listed by {animal.farmer.email}</p>
            )}

            <p className="font-display text-3xl font-bold text-farmart-green-deep mt-4">
              Ksh {animal.price?.toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm border-t border-gray-100 pt-5">
              <div>
                <p className="text-gray-500">Breed</p>
                <p className="font-semibold capitalize">{animal.breed || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Age</p>
                <p className="font-semibold">{animal.age != null ? `${animal.age} months` : '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-semibold capitalize">{animal.type || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold capitalize">{animal.status || '—'}</p>
              </div>
            </div>

            {isAvailable && (
              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="w-full mt-6 bg-farmart-amber text-white rounded-lg py-3 font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isAvailable ? (animal.status === 'sold' ? 'Sold' : 'Pending Sale') : 'Add to Cart'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Farmart holds payment securely until you confirm delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimalDetailPage;