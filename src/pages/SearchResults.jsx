import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Importing heart icons
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const categories = ['All', 'Mystery', 'Fiction', 'Fantasy', 'Non-Fiction', 'Romance', 'Sci-Fi'];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!query && selectedCategory === 'All') {
      setResults([]);
      return;
    }

    setLoading(true);
    
    let searchUrl = `${import.meta.env.VITE_API_URL}/api/books/search?q=${encodeURIComponent(query)}&limit=50`;
    if (selectedCategory !== 'All') {
      searchUrl += `&category=${encodeURIComponent(selectedCategory)}`;
    }

    fetch(searchUrl)
      .then(res => res.json())
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCategory]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (newCategory !== 'All') params.append('category', newCategory);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  // Fetch user's favorite books
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await res.json();
      setFavorites(data.favorites.map(book => book._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast.error('Failed to load your favorites.');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/favorite`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to update favorite status');
      }

      // Update favorites state
      if (favorites.includes(bookId)) {
        setFavorites(prev => prev.filter(id => id !== bookId));
        toast.info('Removed from favorites.');
      } else {
        setFavorites(prev => [...prev, bookId]);
        toast.success('Added to favorites!');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorite status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#e1dcc5]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-lg">Searching...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#e1dcc5]">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Search Results for "<span className="text-blue-600">{query}</span>"
      </h1>

      {/* Category Filter */}
      <div className="mb-8 flex justify-center">
        <label htmlFor="category" className="mr-4 text-lg font-semibold text-gray-700">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="mt-6 text-xl text-gray-600">No books found.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {results.map((book) => (
            <li
              key={book._id}
              className="flex flex-col sm:flex-row items-center bg-white border border-transparent rounded-lg overflow-hidden hover:bg-gray-100 hover:border-blue-500 transition-colors duration-300"
            >
              <div className="relative w-full sm:w-40 h-60">
                <img
                  src={book.image?.url || 'https://via.placeholder.com/150x225'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.genre && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-sm px-2 py-1 rounded">
                    {book.genre}
                  </span>
                )}
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{book.title}</h2>
                <p className="mt-2 text-gray-600">Author: {book.author}</p>
                
                {book.rating && (
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((star, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${index < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.98a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.98c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.785.57-1.838-.197-1.539-1.118l1.286-3.98a1 1 0 00-.364-1.118L2.224 9.407c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.98z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">{book.rating}/5</span>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4 flex space-x-4">
                <Link to={`/books/${book._id}`}>
                  <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    {/* SVG Icon for View Details */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => toggleFavorite(book._id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                    favorites.includes(book._id) ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  title={favorites.includes(book._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  {favorites.includes(book._id) ? (
                    <AiFillHeart className="h-5 w-5 mr-2" />
                  ) : (
                    <AiOutlineHeart className="h-5 w-5 mr-2" />
                  )}
                  {favorites.includes(book._id) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;