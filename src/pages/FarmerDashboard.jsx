import { useEffect, useState } from 'react';
import APIClient from '../../services/apiClient';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '', type: 'Cow', breed: '', age: '', price: '', description: '', image: '', status: 'Available'
  });

  // 1. FETCH MY ANIMALS
  useEffect(() => {
    const fetchMyAnimals = async () => {
      try {
        const res = await APIClient.get(`/animals/farmer/${user._id}`);
        setAnimals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(user) fetchMyAnimals();
  }, [user]);

  // 2. ADD ANIMAL
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await APIClient.post('/animals', {...formData, farmer: user._id});
      setAnimals([res.data, ...animals]);
      setShowForm(false);
      setFormData({ name: '', type: 'Cow', breed: '', age: '', price: '', description: '', image: '', status: 'Available' });
    } catch (err) {
      alert('Failed to add animal');
    }
  };

  // 3. DELETE ANIMAL
  const handleDelete = async (id) => {
    if(!window.confirm('Delete this animal?')) return;
    try {
      await APIClient.delete(`/animals/${id}`);
      setAnimals(animals.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if(loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Livestock</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Animal'}
        </button>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4">
          <input placeholder="Name" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
          <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Cow</option><option>Goat</option><option>Sheep</option><option>Chicken</option>
          </select>
          <input placeholder="Breed" className="input" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})}/>
          <input type="number" placeholder="Age months" className="input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}/>
          <input type="number" placeholder="Price KSH" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required/>
          <input placeholder="Image URL" className="input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}/>
          <textarea placeholder="Description" className="input col-span-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/>
          <button type="submit" className="btn-primary col-span-2">Save Animal</button>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Animal</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map(animal => (
              <tr key={animal._id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <img src={animal.image} className="w-10 h-10 rounded object-cover"/> {animal.name}
                </td>
                <td>{animal.type}</td>
                <td>KSH {animal.price}</td>
                <td>{animal.status}</td>
                <td className="p-3 flex gap-2">
                  <Link to={`/animals/${animal._id}/edit`} className="text-blue-600">Edit</Link>
                  <button onClick={() => handleDelete(animal._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerDashboard;