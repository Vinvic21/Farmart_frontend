import { useEffect, useState } from 'react';
import APIClient from '../../services/apiClient';
import { useSelector } from 'react-redux';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
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
        console.error("Error fetching animals:", err);
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
      console.error(err);
    }
  };

  // 3. UPDATE ANIMAL
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await APIClient.put(`/animals/${editingAnimal._id}`, editingAnimal);
      setAnimals(animals.map(a => a._id === editingAnimal._id ? res.data : a));
      setEditingAnimal(null);
    } catch (err) {
      alert('Failed to update animal');
      console.error(err);
    }
  };

  // 4. DELETE ANIMAL
  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this animal?')) return;
    try {
      await APIClient.delete(`/animals/${id}`);
      setAnimals(animals.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete');
      console.error(err);
    }
  };

  if(loading) return <div className="p-6">Loading your animals...</div>;

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
          <h3 className="col-span-2 text-xl font-semibold">Add New Animal</h3>
          <input placeholder="Name" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
          <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Cow</option><option>Goat</option><option>Sheep</option><option>Chicken</option><option>Other</option>
          </select>
          <input placeholder="Breed" className="input" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})}/>
          <input type="number" placeholder="Age in months" className="input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}/>
          <input type="number" placeholder="Price KSH" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required/>
          <input placeholder="Image URL" className="input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}/>
          <textarea placeholder="Description" className="input col-span-2" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/>
          <button type="submit" className="btn-primary col-span-2">Save Animal</button>
        </form>
      )}

      {/* ANIMALS TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Animal</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">You have no animals listed yet</td></tr>
            ) : (
              animals.map(animal => (
                <tr key={animal._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img src={animal.image || 'https://via.placeholder.com/40'} alt={animal.name} className="w-10 h-10 rounded object-cover"/>
                    {animal.name}
                  </td>
                  <td className="p-3">{animal.type}</td>
                  <td className="p-3">{animal.breed}</td>
                  <td className="p-3">KSH {animal.price}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${animal.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {animal.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => setEditingAnimal(animal)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(animal._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingAnimal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEdit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg grid grid-cols-2 gap-4">
            <h3 className="col-span-2 text-xl font-bold">Edit Animal</h3>
            <input className="input" value={editingAnimal.name} onChange={e => setEditingAnimal({...editingAnimal, name: e.target.value})} required/>
            <select className="input" value={editingAnimal.type} onChange={e => setEditingAnimal({...editingAnimal, type: e.target.value})}>
              <option>Cow</option><option>Goat</option><option>Sheep</option><option>Chicken</option><option>Other</option>
            </select>
            <input className="input" value={editingAnimal.breed} onChange={e => setEditingAnimal({...editingAnimal, breed: e.target.value})}/>
            <input type="number" className="input" value={editingAnimal.price} onChange={e => setEditingAnimal({...editingAnimal, price: e.target.value})} required/>
            <select className="input" value={editingAnimal.status} onChange={e => setEditingAnimal({...editingAnimal, status: e.target.value})}>
              <option>Available</option><option>Sold</option>
            </select>
            <input className="input" value={editingAnimal.image} onChange={e => setEditingAnimal({...editingAnimal, image: e.target.value})}/>
            <textarea className="input col-span-2" rows="3" value={editingAnimal.description} onChange={e => setEditingAnimal({...editingAnimal, description: e.target.value})}/>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary flex-1">Update</button>
              <button type="button" onClick={() => setEditingAnimal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;