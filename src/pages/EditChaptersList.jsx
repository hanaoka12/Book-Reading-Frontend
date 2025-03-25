// src/pages/EditChaptersList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EditChaptersList() {
  const [chapters, setChapters] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setChapters(data.chapters);
        setBookTitle(data.title);
      } catch (error) {
        setError('Error fetching chapters. Please try again.');
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-[#7c98b3] py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">{bookTitle}</h1>
            <h2 className="text-xl text-gray-100 text-center mt-2">Manage Chapters</h2>
          </div>

          <div className="p-8">
            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No chapters added yet.</p>
                <Link
                  to={`/add-chapter/${bookId}`}
                  className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
                >
                  Add First Chapter
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-6 flex justify-between items-center hover:shadow-md transition-all duration-300 hover:transform hover:translate-x-2"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Chapter {index + 1}
                      </h3>
                      <p className="text-gray-600 mt-1">{chapter.title}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {chapter.content.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/edit-chapter/${bookId}/${index + 1}`}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="mt-8 text-center">
                  <Link
                    to={`/add-chapter/${bookId}`}
                    className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
                  >
                    Add New Chapter
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChaptersList;