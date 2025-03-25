import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BookManagement() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/user-books', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error('Error fetching books:', err));
  }, []);

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setBooks(books.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Your Books</h1>
        <Link 
          to="/add-book" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-xl text-gray-600">No books uploaded yet.</p>
          <Link to="/add-book" className="text-blue-600 hover:underline mt-2 inline-block">Add your first book</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="flex p-6">
                <img 
                  src={book.image?.url || book.image}
                  alt={book.title} 
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
                <div className="ml-6 flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to={`/edit-book/${book._id}`} 
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit Info
                    </Link>
                    <Link 
                      to={`/add-chapter/${book._id}`} 
                      className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Add Chapter
                    </Link>
                    <Link 
                      to={`/edit-chapters/${book._id}`} 
                      className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                    >
                      Edit Chapters
                    </Link>
                    <button 
                      onClick={() => deleteBook(book._id)} 
                      className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookManagement;
