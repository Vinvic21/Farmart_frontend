import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import APIClient from '../../services/apiClient'

const TYPE_EMOJI = { cow: '', goat: '', sheep: '', chicken: '' }

// Shrinks whatever the user picks from their gallery down to a reasonable
// JPEG data URL before it goes anywhere near image_url — full-res phone
// photos as base64 are several MB and would bloat the request/DB column.
function resizeImageFile(file, maxSize = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not read that image'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

const inputClass =
  'w-full border border-gray-200 bg-white px-3.5 py-2.5 rounded-lg text-gray-800 placeholder:text-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-farmart-green/40 focus:border-farmart-green transition-colors duration-150'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const AnimalFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    type: 'cow', breed: '', price: '', age: '', description: '', status: 'available', image_url: '',
  })
  const [imageMode, setImageMode] = useState('link') // 'link' | 'gallery'
  const [imageError, setImageError] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    const loadAnimal = async () => {
      try {
        const res = await APIClient.get(`/animals/${id}`)
        setForm({
          type: res.data.type || 'cow',
          breed: res.data.breed || '',
          price: res.data.price || '',
          age: res.data.age ?? '',
          description: res.data.description || '',
          status: res.data.status || 'available',
          image_url: res.data.image_url || '',
        })
      } catch (err) {
        console.error(err)
        alert('Failed to load animal details')
      } finally {
        setLoading(false)
      }
    }
    loadAnimal()
  }, [id, isEdit])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.')
      return
    }
    setImageError(null)
    try {
      const dataUrl = await resizeImageFile(file)
      setForm((f) => ({ ...f, image_url: dataUrl }))
    } catch (err) {
      setImageError(err.message || 'Failed to process image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      age: form.age === '' ? null : parseInt(form.age, 10),
      image_url: form.image_url || null,
    }
    try {
      if (isEdit) {
        await APIClient.patch(`/animals/${id}`, payload)
      } else {
        await APIClient.post('/animals', payload)
      }
      navigate('/farmer/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.response?.data?.error || 'Failed to save animal')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-farmart-cream min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/farmer/dashboard" className="text-sm text-gray-500 hover:text-farmart-green-deep transition-colors">
          &larr; Back to Dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold text-gray-800 mt-2 mb-6">
          {isEdit ? 'Edit Animal' : 'List New Animal'}
        </h1>

        {error && (
          <p className="text-red-600 mb-4 text-sm break-words bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          {/* Photo */}
          <div>
            <span className={labelClass}>Photo</span>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-farmart-green/10 to-farmart-cream border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.image_url ? (
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={() => setImageError('That image could not be loaded.')} />
                ) : (
                  <span className="text-5xl">{TYPE_EMOJI[form.type] || '🐾'}</span>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 mb-3 bg-gray-50">
                  {['link', 'gallery'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setImageMode(mode); setImageError(null) }}
                      className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                        imageMode === mode ? 'bg-white shadow-sm text-farmart-green-deep' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {mode === 'link' ? ' Image link' : 'From gallery'}
                    </button>
                  ))}
                </div>

                {imageMode === 'link' ? (
                  <input
                    type="url" placeholder="https://example.com/photo.jpg"
                    value={form.image_url.startsWith('data:') ? '' : form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    className={inputClass}
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef} type="file" accept="image/*"
                      onChange={handleFileChange} className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto border border-gray-200 hover:border-farmart-green hover:text-farmart-green-deep px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 transition-colors duration-150"
                    >
                      Choose photo…
                    </button>
                  </div>
                )}

                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                    className="text-xs text-gray-400 hover:text-red-500 mt-2 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
                {imageError && <p className="text-red-600 text-xs mt-2">{imageError}</p>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputClass}>
                <option value="cow"> Cow</option>
                <option value="goat">Goat</option>
                <option value="sheep"> Sheep</option>
                <option value="chicken"> Chicken</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Breed</label>
              <input type="text" placeholder="e.g. Friesian" value={form.breed} onChange={set('breed')} className={inputClass} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (Ksh)</label>
              <input type="number" placeholder="0.00" value={form.price} min="0" step="0.01" onChange={set('price')} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Age (months)</label>
              <input type="number" placeholder="Optional" value={form.age} min="0" onChange={set('age')} className={inputClass} />
            </div>
          </div>

          {isEdit && (
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={set('status')} className={inputClass}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          )}

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="Tell buyers about this animal — health, temperament, feeding history…"
              value={form.description} onChange={set('description')} rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/farmer/dashboard"
              className="flex-1 text-center border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-lg py-3 transition-colors duration-150"
            >
              Cancel
            </Link>
            <button
              disabled={saving}
              className="flex-1 bg-farmart-green-deep hover:bg-farmart-green-deep/90 text-white font-bold rounded-lg py-3 disabled:opacity-60 transition-colors duration-150 shadow-sm"
            >
              {saving ? 'Saving…' : isEdit ? 'Update Animal' : 'Save Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AnimalFormPage