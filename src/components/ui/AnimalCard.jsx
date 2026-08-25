import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg p-4 bg-white">
      <img 
        src={animal.image || '/placeholder.jpg'} 
        alt={animal.name} 
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-xl font-semibold mt-3">{animal.name}</h3>
      <p className="text-gray-600">{animal.breed} - {animal.age} months</p>
      <p className="text-green-700 font-bold text-lg">Ksh {animal.price}</p>
      <p className="text-sm text-gray-500">By: {animal.farmer?.name || 'Farmart'}</p>
      
      <Link 
        to={`/animals/${animal._id}`}
        className="mt-3 inline-block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default AnimalCard; 