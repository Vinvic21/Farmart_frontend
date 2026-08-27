import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom' // <- added this for details page
import { addToCart } from '../../features/cart/cartSlice'
import toast from 'react-hot-toast'

const allAnimals = [ // pretend this is from API
  { id: 1, name: "Goat", price: 15000, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400", category: "Goat" },
  { id: 2, name: "Cow", price: 80000, img: "https://images.unsplash.com/photo-1527153857098-ia0a6f81a3f4?w=400", category: "Cow" },
  { id: 3, name: "Chicken", price: 1200, img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400", category: "Chicken" },
  { id: 4, name: "Sheep", price: 20000, img: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400", category: "Sheep" },
  { id: 5, name: "Goat 2", price: 18000, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400", category: "Goat" },
  { id: 6, name: "Cow 2", price: 90000, img: "https://images.unsplash.com/photo-1527153857098-ia0a6f81a3f4?w=400", category: "Cow" },
]

export default function Browse() {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 4

  const filtered = allAnimals.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) && 
    (filter === 'All' || a.category === filter)
  )
  
  const paginated = filtered.slice((page-1)*perPage, page*perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const handleAddToCart = (animal) => {
    dispatch(addToCart(animal))
    toast.success(`${animal.name} added to cart!`)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Animals for Sale</h2>
      
      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search animals..."
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filter}
          onChange={e => {setFilter(e.target.value); setPage(1)}}
        >
          <option>All</option>
          <option>Goat</option>
          <option>Cow</option>
          <option>Chicken</option>
          <option>Sheep</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginated.length > 0 ? paginated.map(animal => (
          <div key={animal.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition flex flex-col">
            <Link to={`/animal/${animal.id}`}>
              <img src={animal.img} className="w-full h-48 object-cover rounded" alt={animal.name} />
              <h3 className="font-bold text-xl mt-3 hover:text-green-600">{animal.name}</h3>
            </Link>
            <p className="text-gray-600 mb-3">Ksh {animal.price.toLocaleString()}</p>
            <button 
              onClick={() => handleAddToCart(animal)}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded font-medium transition mt-auto"
            >
              Add to Cart
            </button>
          </div>
        )) : (
          <p className="col-span-4 text-center text-gray-500">No animals found</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({length: totalPages}).map((_, i) => (
            <button 
              key={i}
              onClick={() => setPage(i+1)}
              className={`px-4 py-2 rounded font-medium transition ${page === i+1 ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}