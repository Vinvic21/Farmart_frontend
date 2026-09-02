import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProfile, clearPublicProfile } from '../../features/user/userProfileSlice';
import { addToCart } from '../../features/cart/cartSlice';

const TYPE_EMOJI = { cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔' };

function toWhatsAppNumber(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  return digits;
}

export default function FarmerProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicProfile: profile, publicListings: listings, publicLoading, publicError } = useSelector((state) => state.userProfile);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPublicProfile(id));
    return () => dispatch(clearPublicProfile());
  }, [id, dispatch]);

  const handleAddToCart = async (animal) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const result = await dispatch(addToCart({ animalId: animal.id }));
    if (result.meta.requestStatus === 'fulfilled') {
      alert(`${animal.breed || animal.type} added to cart!`);
    } else {
      alert(result.payload || 'Failed to add to cart');
    }
  };

  if (publicLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Loading profile...</div>;
  }

  if (publicError || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-semibold mb-2">Couldn't load this profile.</p>
        <p className="text-gray-500 text-sm mb-6">{publicError}</p>
        <Link to="/browse" className="text-farmart-green-deep font-medium">← Back to browse</Link>
      </div>
    );
  }

  const isVerified = profile.profile?.verification_status === 'verified';
  const whatsappNumber = toWhatsAppNumber(profile.profile?.phone);
  const initial = profile.name ? profile.name[0].toUpperCase() : '?';

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/browse" className="text-sm text-gray-500 hover:text-farmart-green-deep mb-6 inline-block">
          ← Back to browse
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-farmart-green/10 text-farmart-green-deep flex items-center justify-center text-3xl font-bold shrink-0 border-4 border-farmart-cream">
              {initial}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-gray-800">{profile.name || 'Farmart User'}</h1>
                {isVerified ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-farmart-green/10 text-farmart-green-deep">✓ Verified</span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Unverified</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1 capitalize">{profile.role}{profile.profile?.location ? ` · ${profile.profile.location}` : ''}</p>
              {profile.profile?.bio && (
                <p className="text-gray-600 text-sm mt-3 max-w-xl">{profile.profile.bio}</p>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                {profile.profile?.phone && (
                  <a
                    href={`tel:${profile.profile.phone}`}
                    className="flex items-center gap-1.5 bg-farmart-green-deep text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-farmart-green-deep/90 transition-colors"
                  >
                    📞 Call {profile.profile.phone}
                  </a>
                )}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {!profile.profile?.phone && (
                  <p className="text-sm text-gray-400">No contact details shared yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {profile.role === 'farmer' && (
          <>
            <h2 className="font-display text-xl font-bold text-gray-800 mb-4">
              {listings.length > 0 ? `Listings from ${profile.name || 'this farmer'}` : 'No active listings right now'}
            </h2>
            {listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((animal) => {
                  const emoji = TYPE_EMOJI[(animal.type || '').toLowerCase()] || '🐾';
                  return (
                    <div key={animal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <Link to={`/animal/${animal.id}`} className="block h-40 bg-gradient-to-br from-farmart-green/10 to-farmart-cream flex items-center justify-center text-5xl overflow-hidden">
                        {animal.image_url ? (
                          <img
                            src={animal.image_url}
                            alt={`${animal.breed} ${animal.type}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <span style={animal.image_url ? { display: 'none' } : undefined}>{emoji}</span>
                      </Link>
                      <div className="p-4">
                        <Link to={`/animal/${animal.id}`} className="font-display font-bold text-gray-800 capitalize hover:text-farmart-green-deep">
                          {animal.breed} {animal.type}
                        </Link>
                        <p className="text-farmart-green-deep font-bold mt-1">Ksh {animal.price?.toLocaleString()}</p>
                        <button
                          onClick={() => handleAddToCart(animal)}
                          className="mt-3 w-full bg-farmart-amber text-white text-sm font-semibold py-2 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}