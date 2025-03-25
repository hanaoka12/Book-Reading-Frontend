import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Importing heart icons
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch favorite books
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
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(true);
      toast.error('Failed to load your favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a book from favorites
  const removeFromFavorites = async (bookId) => {
    const confirmRemoval = window.confirm('Are you sure you want to remove this book from your favorites?');
    if (!confirmRemoval) return;

    // Optimistic UI Update
    const updatedFavorites = favorites.filter(book => book._id !== bookId);
    setFavorites(updatedFavorites);

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
        throw new Error('Failed to remove favorite');
      }

      toast.success('Book removed from favorites!');
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove the book from favorites.');
      // Revert UI update if there's an error
      fetchFavorites();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <p className="text-red-500 text-lg">Something went wrong. Please try again later.</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Favorites</h1>
          <Link to="/">
            <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <ul className="space-y-6">
            {favorites.map(book => (
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
                  <p className="mt-2 text-gray-600">by {book.author}</p>
                  
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
                    onClick={() => removeFromFavorites(book._id)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    title="Remove from Favorites"
                  >
                    <AiFillHeart className="h-5 w-5 mr-2" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center mt-16">
            <AiFillHeart className="h-24 w-24 text-red-500 mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Favorites Yet!</h2>
            <p className="text-gray-600 mb-6">Browse our collection and add your favorite books here.</p>
            <Link to="/">
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Browse Books
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourite;