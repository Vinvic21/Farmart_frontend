import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchAnimals } from '../../features/animals/animalsSlice'
import { addToCart } from '../../features/cart/cartSlice'
import toast from 'react-hot-toast'
import AnimalCard from '../../components/ui/AnimalCard'

const TYPE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Cattle', value: 'cow' },
  { label: 'Goats', value: 'goat' },
  { label: 'Sheep', value: 'sheep' },
  { label: 'Poultry', value: 'chicken' },
]

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

export default function BrowsePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { list: animals, listStatus, listError, currentPage, totalPages, total } = useSelector((state) => state.animals)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [search, setSearch] = useState('')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAnimals({ page, search, type, minPrice, maxPrice }))
  }, [dispatch, page, search, type, minPrice, maxPrice])

  const sortedAnimals = useMemo(() => {
    if (sortBy === 'price_asc') return [...animals].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === 'price_desc') return [...animals].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return animals
  }, [animals, sortBy])

  const handleAddToCart = async (animal) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const result = await dispatch(addToCart({ animalId: animal.id, quantity: 1 }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`${animal.breed || animal.type} added to cart!`)
    } else {
      toast.error(result.payload || 'Failed to add to cart')
    }
  }

  const activeFilters = [
    search && { key: 'search', label: `"${search}"`, clear: () => setSearch('') },
    type && { key: 'type', label: TYPE_FILTERS.find((t) => t.value === type)?.label, clear: () => setType('') },
    minPrice && { key: 'min', label: `Min Ksh ${minPrice}`, clear: () => setMinPrice('') },
    maxPrice && { key: 'max', label: `Max Ksh ${maxPrice}`, clear: () => setMaxPrice('') },
  ].filter(Boolean)

  return (
    <div className="bg-farmart-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by breed... (e.g. Angus, Boer)"
            className="w-full border border-gray-200 bg-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmart-green"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              onClick={() => { setType(f.value); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                type === f.value
                  ? 'bg-farmart-green text-white border-farmart-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-farmart-green'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <input
              type="number"
              min="0"
              placeholder="Min Ksh"
              className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min="0"
              placeholder="Max Ksh"
              className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-farmart-green"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>Sort: {s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={f.clear}
                className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:border-red-300 hover:text-red-500 transition"
              >
                {f.label} <span className="text-gray-400">×</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-800">
            {listStatus === 'succeeded' ? `${total} result${total === 1 ? '' : 's'}` : 'Animals for Sale'}
            {search && <span className="text-gray-500 font-normal"> for &ldquo;{search}&rdquo;</span>}
          </h2>
        </div>

        {listStatus === 'loading' && <p className="text-center text-gray-500 py-16">Loading animals...</p>}
        {listStatus === 'failed' && <p className="text-center text-red-500 py-16">{listError}</p>}

        {listStatus === 'succeeded' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedAnimals.length > 0 ? sortedAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} onAddToCart={handleAddToCart} />
            )) : (
              <p className="col-span-full text-center text-gray-500 py-16">No animals found</p>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg font-medium transition ${currentPage === i + 1 ? 'bg-farmart-green text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-farmart-green'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}