import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Animals for Sale</h2>
      
      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search animals..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="border p-2 rounded"
          value={filter}
          onChange={e => setFilter(e.target.value)}
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
        {paginated.map(animal => (
          <div key={animal.id} className="bg-white rounded-lg shadow p-4">
            <img src={animal.img} className="w-full h-48 object-cover rounded" alt={animal.name} />
            <h3 className="font-bold text-xl mt-3">{animal.name}</h3>
            <p className="text-gray-600">Ksh {animal.price.toLocaleString()}</p>
            <button 
              onClick={() => dispatch(addToCart(animal))}
              className="bg-farmart-green text-white w-full py-2 rounded mt-3"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({length: totalPages}).map((_, i) => (
          <button 
            key={i}
            onClick={() => setPage(i+1)}
            className={`px-4 py-2 rounded ${page === i+1 ? 'bg-farmart-green text-white' : 'bg-gray-200'}`}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  )
}