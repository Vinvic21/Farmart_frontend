import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AnimalFormPage = () => {
  const { id } = useParams() // kama kuna id = edit mode
  const navigate = useNavigate()
  const isEdit = !!id
  
  const [form, setForm] = useState({ name: '', price: '', type: 'cow', description: '', image: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isEdit ? 'Updating' : 'Adding', form)
    alert(`Animal ${isEdit ? 'updated' : 'added'}!`)
    navigate('/farmer/dashboard')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Animal' : 'Add New Animal'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Animal Name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" required/>
        <input type="number" placeholder="Price Ksh" value={form.price}
          onChange={e => setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" required/>
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2 rounded">
          <option value="cow">Cow</option><option value="goat">Goat</option><option value="sheep">Sheep</option>
        </select>
        <textarea placeholder="Description" value={form.description}
          onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded"></textarea>
        <input type="text" placeholder="Image URL" value={form.image}
          onChange={e => setForm({...form, image: e.target.value})} className="w-full border p-2 rounded"/>
        <button className="bg-green-600 text-white px-6 py-2 rounded w-full">{isEdit ? 'Update' : 'Save'} Animal</button>
      </form>
    </div>
  )
}

export default AnimalFormPage