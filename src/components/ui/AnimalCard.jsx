import { Link } from 'react-router-dom';

const TYPE_EMOJI = {
  cow: '🐄',
  goat: '🐐',
  sheep: '🐑',
  chicken: '🐔',
};

const STATUS_STYLES = {
  available: 'bg-farmart-green/10 text-farmart-green-deep',
  pending: 'bg-amber-100 text-amber-700',
  sold: 'bg-gray-200 text-gray-600',
};

const AnimalCard = ({ animal, onAddToCart }) => {
  const title = animal.breed ? `${animal.breed} ${animal.type || ''}`.trim() : animal.type;
  const emoji = TYPE_EMOJI[(animal.type || '').toLowerCase()] || '🐾';
  const isAvailable = animal.status === 'available';

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link to={`/animal/${animal.id}`} className="relative block">
        <div className="w-full h-44 bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-7xl overflow-hidden">
          {animal.image_url ? (
            <img
              src={animal.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <span
            className={`group-hover:scale-110 transition-transform ${animal.image_url ? 'hidden' : ''}`}
            style={animal.image_url ? { display: 'none' } : undefined}
          >
            {emoji}
          </span>
        </div>
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
            STATUS_STYLES[animal.status] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {animal.status || 'available'}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/animal/${animal.id}`}>
          <h3 className="font-display font-bold text-gray-800 leading-snug hover:text-farmart-green-deep transition-colors capitalize">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {animal.farmer?.email ? `Listed by ${animal.farmer.email}` : 'Farmart listing'}
        </p>
        {animal.age != null && (
          <p className="text-xs text-gray-500 mt-1">{animal.age} months old</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="font-display font-bold text-lg text-farmart-green-deep">
            Ksh {animal.price?.toLocaleString()}
          </p>

          {onAddToCart ? (
            <button
              onClick={() => onAddToCart(animal)}
              disabled={!isAvailable}
              title={isAvailable ? 'Add to cart' : 'Unavailable'}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-farmart-amber text-white hover:bg-amber-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🛒
            </button>
          ) : (
            <Link
              to={`/animal/${animal.id}`}
              className="text-sm font-semibold text-farmart-green-deep hover:underline"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;