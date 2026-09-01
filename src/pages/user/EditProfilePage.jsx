import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { fetchUserProfile, updateUserProfile } from '../../features/user/userProfileSlice'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, loading, error, updateStatus } = useSelector((state) => state.userProfile)
  const { user: authUser } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: '',
  })

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Profile updated successfully!')
      setTimeout(() => navigate('/profile'), 500)
    }
    if (updateStatus === 'failed') {
      toast.error(error || 'Failed to update profile')
    }
  }, [updateStatus, error, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate inputs
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error('First and last name are required')
      return
    }

    await dispatch(updateUserProfile(formData))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-farmart-cream px-4 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-farmart-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-500 mt-2">Update your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Name Section */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Contact Information</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || authUser?.email || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 2547XXXXXXXX"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
                />
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Location</h3>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City / Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nairobi, Kenya"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-farmart-green/40"
              />
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">About You</h3>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-farmart-green/40 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>

            {/* Buttons */}
            <div className="pt-6 border-t border-gray-100 flex gap-3">
              <Link
                to="/profile"
                className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateStatus === 'loading'}
                className="flex-1 px-4 py-3 bg-farmart-green text-white rounded-lg text-sm font-semibold hover:bg-farmart-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
