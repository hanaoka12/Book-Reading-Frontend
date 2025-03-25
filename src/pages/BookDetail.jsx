import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Importing heart icons

function BookDetails() {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status
  const [favoriteLoading, setFavoriteLoading] = useState(false); // State to track favorite button loading

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setBook(data);
        setLoading(false);
        
        // After fetching the book, check if it's a favorite
        checkIfFavorite(data._id);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Function to check if the current book is in user's favorites
  const checkIfFavorite = async (bookId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      const isFav = data.favorites.some(favBook => favBook._id === bookId);
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  // Function to toggle favorite status
  const toggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${book._id}/favorite`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' // Ensure Content-Type is set
        }
      });
      const data = await response.json();
      setIsFavorite(!isFavorite); // Toggle the favorite state
      alert(isFavorite ? 'Removed from favorites!' : 'Added to favorites!');
    } catch (err) {
      console.error(err);
      alert('Failed to update favorites.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) return <div className="text-center p-8">Book not found</div>;

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-8"> {/* Reduced from py-12 */}
      <div className="container mx-auto px-4 max-w-6xl"> {/* Reduced from max-w-7xl */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12 bg-white rounded-xl shadow-lg p-6"> {/* Reduced padding and gap */}
          {/* Book Image Section - Keep same size for visual impact */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative group">
              <img 
                src={book.image?.url || book.image} 
                alt={book.title} 
                className="w-[300px] h-[450px] object-cover rounded-lg shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
            </div>
          </div>

          {/* Book Details Section */}
          <div className="flex-1 space-y-4"> {/* Reduced from space-y-6 */}
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1> {/* Reduced from text-4xl */}
            
            <div className="space-y-3"> {/* Reduced from space-y-4 */}
              {/* Author */}
              <div className="flex items-center space-x-2 text-base text-gray-600"> {/* Reduced from text-lg */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p><span className="font-medium">Author:</span> {book.author}</p>
              </div>

              {/* Genre */}
              <div className="flex items-center space-x-2 text-base text-gray-600"> {/* Reduced from text-lg */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p><span className="font-medium">Genre:</span> {book.genre}</p>
              </div>

              {/* Description */}
              <div className="mt-4 prose prose-base max-w-none text-gray-600"> {/* Changed from prose-lg */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2> {/* Reduced from text-2xl and mb-4 */}
                <p>{book.description}</p>
              </div>
              <button
                onClick={toggleFavorite}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 
                  ${isFavorite ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                  `}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4">
                    </circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8v8H4z">
                    </path>
                  </svg>
                ) : isFavorite ? (
                  <AiFillHeart className="h-6 w-6 mr-2" />
                ) : (
                  <AiOutlineHeart className="h-6 w-6 mr-2" />
                )}
                {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6"> {/* Reduced from mt-12 and p-8 */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3"> {/* Reduced from text-3xl, mb-8, and pb-4 */}
            Chapters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduced from gap-6 */}
            {book.chapters.map((chapter, index) => (
              <Link 
                key={index}
                to={`/books/${id}/chapter/${index + 1}`}
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3"> {/* Reduced from space-x-4 */}
                  <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      Chapter {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">{chapter.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
