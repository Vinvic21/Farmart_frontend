import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimalById, clearCurrentAnimal } from '../../features/animals/animalsSlice';

function AnimalDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: animal, detailStatus, detailError } = useSelector((state) => state.animals);

  useEffect(() => {
    dispatch(fetchAnimalById(id));
    return () => {
      dispatch(clearCurrentAnimal());
    };
  }, [id, dispatch]);

  // cartSlice.js is still empty. Once it has a real addToCart
  // action, replace this with:
  //   dispatch(addToCart({ animalId: animal.id, quantity: 1 }))
  const handleAddToCart = () => {
    alert(`${animal.breed} ${animal.type} added to cart (placeholder — cart not wired up yet)`);
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
        <p className="text-danger font-semibold mb-2">Couldn't load this animal.</p>
        <p className="text-gray-500 text-sm mb-6">{detailError}</p>
        <Link to="/browse" className="text-primary font-medium">
          ← Back to browse
        </Link>
      </div>
    );
  }

  if (!animal) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      <Link to="/browse" className="text-sm text-gray-500 hover:text-primary mb-6 inline-block">
        ← Back to browse
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden sm:flex">
        <div className="sm:w-1/2 bg-gray-100 flex items-center justify-center py-16 sm:py-0">
          {animal.image_url ? (
            <img
              src={animal.image_url}
              alt={`${animal.breed} ${animal.type}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">🐾</span>
          )}
        </div>

        <div className="p-6 sm:p-8 sm:w-1/2">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {animal.type}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{animal.breed}</h1>
          <p className="text-gray-500 text-sm mb-4">from {animal.farmer_name}</p>

          <p className="text-3xl font-bold text-primary mb-6">
            ${animal.price?.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-semibold">{animal.age_months} months</p>
            </div>
            <div>
              <p className="text-gray-500">Available</p>
              <p className="font-semibold">{animal.quantity_available} in stock</p>
            </div>
          </div>

          {animal.description && (
            <p className="text-gray-600 text-sm mb-8">{animal.description}</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={animal.status === 'sold_out'}
            className="w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {animal.status === 'sold_out' ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnimalDetailPage;