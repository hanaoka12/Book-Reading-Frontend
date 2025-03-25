// EditChapter.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditChapter() {
  const { bookId } = useParams();
  const [chapterContent, setChapterContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);

  useEffect(() => {
    // Fetch existing chapter data
    fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapters/${chapterNumber}`)
      .then((res) => res.json())
      .then((data) => setChapterContent(data.content))
      .catch((err) => console.error('Error fetching chapter:', err));
  }, [bookId, chapterNumber]);

  const handleSave = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapters/${chapterNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: chapterContent }),
      });
      alert('Chapter updated successfully!');
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-[#7c98b3] py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">Edit Chapter</h1>
          </div>

          <div className="p-8 space-y-6">
            <textarea
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <button 
              onClick={handleSave} 
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChapter;
