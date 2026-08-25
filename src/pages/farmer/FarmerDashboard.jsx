import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const FarmerDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyAnimals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/animals/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setAnimals(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if(token) fetchMyAnimals()
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal?')) return
    await fetch(`http://localhost:5000/api/animals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setAnimals(animals.filter(a => a._id !== id))
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Farm</h1>
        <Link to="/farmer/add-animal" className="bg-green-600 text-white px-4 py-2 rounded">
          + Add Animal
        </Link>
      </div>

      {animals.length === 0 ? (
        <p>You have no animals listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {animals.map(animal => (
            <div key={animal._id} className="border p-4 rounded shadow">
              <img src={animal.image} alt={animal.name} className="w-full h-40 object-cover mb-2"/>
              <h3 className="font-bold">{animal.name}</h3>
              <p>Ksh {animal.price}</p>
              <div className="flex gap-2 mt-2">
                <Link to={`/farmer/edit-animal/${animal._id}`} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</Link>
                <button onClick={() => handleDelete(animal._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard