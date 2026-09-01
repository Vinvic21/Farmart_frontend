import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUserProfile } from '../../features/user/userProfileSlice'

const ROLE_BADGES = {
  buyer: 'bg-blue-100 text-blue-800',
  farmer: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800',
}

export default function UserProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading, error } = useSelector((state) => state.userProfile)
  const { user: authUser } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-farmart-cream px-4 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-farmart-cream px-4 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/"
            className="text-farmart-green hover:underline font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  const displayProfile = profile || authUser

  return (
    <div className="min-h-screen bg-farmart-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-800">My Profile</h1>
          <Link
            to="/profile/edit"
            className="bg-farmart-green text-white px-4 py-2 rounded-lg hover:bg-farmart-green/90 font-medium transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-farmart-green/10 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {displayProfile?.first_name} {displayProfile?.last_name}
              </h2>
              <p className="text-gray-500">{displayProfile?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_BADGES[displayProfile?.role] || 'bg-gray-100 text-gray-700'}`}>
                {displayProfile?.role}
              </span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <p className="text-gray-800">{displayProfile?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  First Name
                </label>
                <p className="text-gray-800">{displayProfile?.first_name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Last Name
                </label>
                <p className="text-gray-800">{displayProfile?.last_name || 'Not set'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone
              </label>
              <p className="text-gray-800">{displayProfile?.phone || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Location
              </label>
              <p className="text-gray-800">{displayProfile?.location || 'Not set'}</p>
            </div>

            {displayProfile?.bio && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Bio
                </label>
                <p className="text-gray-800">{displayProfile.bio}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Member Since
              </label>
              <p className="text-gray-800">
                {displayProfile?.created_at
                  ? new Date(displayProfile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-6 border-t border-gray-100 flex gap-3">
            <Link
              to="/"
              className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/profile/edit"
              className="flex-1 text-center px-4 py-3 bg-farmart-green text-white rounded-lg text-sm font-semibold hover:bg-farmart-green/90 transition-colors"
            >
              Edit Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
