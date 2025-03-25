import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import novelIcon from '../assets/novel.png';
import { debounce } from '../utils/debounce';

const ErrorFallback = ({ error }) => (
  <div className="p-4 text-center">
    <div className="text-red-500 text-sm mb-1">
      Search failed: {error.message}
    </div>
    {error.details && (
      <div className="text-xs text-gray-500">
        {error.details.message}
      </div>
    )}
  </div>
);

const Navbar = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserAvatar(data.avatar?.url);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Create search function
  const searchBooks = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      // Log the exact URL being called
      const searchUrl = `${import.meta.env.VITE_API_URL}/api/books/search?q=${encodeURIComponent(term)}`;
      console.log('Calling API:', searchUrl);
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      // Log response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const data = await response.json();
      console.log('Raw response data:', data);

      // Check specific status codes
      if (response.status === 500) {
        console.error('Server error details:', data);
        throw new Error('Internal server error - check server logs');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Validate response data structure
      if (!Array.isArray(data)) {
        console.error('Invalid data structure:', data);
        throw new Error('Invalid response format');
      }

      setSearchResults(data);
      console.log('Search completed successfully');

    } catch (err) {
      console.error('Full error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        cause: err.cause
      });
      setError(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((term) => {
      searchBooks(term);
    }, 300)
  ).current;

  // Handle input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle result click
  const handleBookClick = (bookId) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(`/books/${bookId}`);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Navigate to the full search results page
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    }
  };

  return (
    <nav className="bg-[#e1dcc5] p-1">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-black text-xl flex items-center gap-2">
          <img src={novelIcon} alt="Novel Icon" className="w-8 h-8" />
          Novely
        </Link>

        {/* Search Bar */}
        <div className="relative w-1/3" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search books..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchTerm && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : error ? (
                <ErrorFallback error={error} />
              ) : searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => handleBookClick(book._id)}
                    className="p-4 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-4"
                  >
                    {/* Book Image */}
                    <img 
                      src={book.image?.url || 'https://via.placeholder.com/60x80'} 
                      alt={book.title}
                      className="w-[60px] h-[80px] object-cover rounded shadow-sm"
                    />
                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 hover:text-blue-600">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                    {/* Arrow Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center py-2 pr-2">
          {!isAuthenticated() && (
            <>
              <Link to="/login" className="text-black mr-6">Login</Link> {/* Changed mr-4 to mr-6 */}
              <Link to="/register" className="text-black mr-6">Register</Link> {/* Changed mr-4 to mr-6 */}
            </>
          )}
          {isAuthenticated() && (
            <>
              <Link to="/add-book" className="text-black mr-4">Add book</Link>
              <Link to="/manage-books" className="text-black mr-4">Manage book</Link>
              <Link to="/profile" className="mr-4">
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
              <button onClick={logout} className="text-black">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;