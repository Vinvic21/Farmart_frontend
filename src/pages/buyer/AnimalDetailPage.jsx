import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../features/cartSlice'

// Same dummy data as Browse
const allAnimals = [
  { id: 1, name: "Goat", price: 15000, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400", category: "Goat", desc: "Healthy 2 year old goat from Nakuru" },
  { id: 2, name: "Cow", price: 80000, img: "https://images.unsplash.com/photo-1527153857098-ia0a6f81a3f4?w=400", category: "Cow", desc: "Friesian dairy cow, produces 20L daily" },
  { id: 3, name: "Chicken", price: 1200, img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400", category: "Chicken", desc: "Kienyeji chicken, 6 months old" },
  { id: 4, name: "Sheep", price: 20000, img: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400", category: "Sheep", desc: "Dorper sheep from Kajiado" },
  { id: 5, name: "Goat 2", price: 18000, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400", category: "Goat", desc: "Boer goat, very healthy" },
  { id: 6, name: "Cow 2", price: 90000, img: "https://images.unsplash.com/photo-1527153857098-ia0a6f81a3f4?w=400", category: "Cow", desc: "Boran bull, 3 years old" },
]

export default function AnimalDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const animal = allAnimals.find(a => a.id === parseInt(id))

  if (!animal) return <div className="p-8 text-center">Animal not found</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={animal.img} alt={animal.name} className="w-full rounded-lg shadow" />
        <div>
          <h1 className="text-4xl font-bold mb-2">{animal.name}</h1>
          <p className="text-gray-500 mb-4">Category: {animal.category}</p>
          <p className="text-3xl font-bold text-green-600 mb-4">Ksh {animal.price.toLocaleString()}</p>
          <p className="text-gray-700 mb-6">{animal.desc}</p>
          
          <button 
            onClick={() => {dispatch(addToCart(animal)); alert(`${animal.name} added to cart!`)}}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}