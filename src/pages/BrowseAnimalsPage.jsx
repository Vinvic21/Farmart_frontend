import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- new
import APIClient from '../services/apiClient';
import AnimalCard from '../components/ui/AnimalCard';

const BrowseAnimalsPage = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // NEW: search params
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [breed, setBreed] = useState(searchParams.get('breed') || '');
  const [minAge, setMinAge] = useState(searchParams.get('minAge') || '');
  const [maxAge, setMaxAge] = useState(searchParams.get('maxAge') || '');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page,
          limit: 9,
          search,
          breed,
          minAge,
          maxAge
        }).toString();
        
        const res = await APIClient.get(`/animals?${query}`);
        setAnimals(res.data.animals);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
    setSearchParams({ page, search, breed, minAge, maxAge }); // update URL
  }, [page, search, breed, minAge, maxAge]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1); // reset to page 1 when filtering
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Browse Animals</h2>

      {/* SEARCH + FILTER PANEL */}
      <form onSubmit={handleFilter} className="bg-white p-4 rounded shadow mb-6 grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 col-span-full">
          Apply Filters
        </button>
      </form>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((animal) => (
          <AnimalCard key={animal._id} animal={animal} />
        ))}
      </div>

      {/* PAGINATION - same as before */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseAnimalsPage;