import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import APIClient from '../../services/apiClient'

const AnimalFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    type: 'cow', breed: '', price: '', age: '', description: '', status: 'available',
  })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      age: form.age === '' ? null : parseInt(form.age, 10),
    }
    try {
      if (isEdit) {
        await APIClient.patch(`/animals/${id}`, payload)
        alert('Animal updated!')
      } else {
        await APIClient.post('/animals', payload)
        alert('Animal added!')
      }
      navigate('/farmer/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.response?.data?.error || 'Failed to save animal')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Animal' : 'Add New Animal'}</h1>

      {error && <p className="text-red-600 mb-4 text-sm break-words">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border p-2 rounded">
          <option value="cow">Cow</option>
          <option value="goat">Goat</option>
          <option value="sheep">Sheep</option>
          <option value="chicken">Chicken</option>
        </select>
        <input type="text" placeholder="Breed" value={form.breed}
          onChange={e => setForm({ ...form, breed: e.target.value })} className="w-full border p-2 rounded" required />
        <input type="number" placeholder="Price Ksh" value={form.price} min="0" step="0.01"
          onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border p-2 rounded" required />
        <input type="number" placeholder="Age (months)" value={form.age} min="0"
          onChange={e => setForm({ ...form, age: e.target.value })} className="w-full border p-2 rounded" />
        {isEdit && (
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border p-2 rounded">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        )}
        <textarea placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" />
        <button disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded w-full disabled:opacity-50">
          {saving ? 'Saving...' : `${isEdit ? 'Update' : 'Save'} Animal`}
        </button>
      </form>
    </div>
  )
}

export default AnimalFormPage