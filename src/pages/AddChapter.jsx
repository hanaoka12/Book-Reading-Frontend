import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AddChapter() {
  const { bookId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setSuccess('Chapter added successfully!');
        setTitle('');
        setContent('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add chapter.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while adding the chapter.');
    }
  };

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#7c98b3] py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Add New Chapter
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={handleAddChapter} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="block text-gray-700 font-medium">
                  Chapter Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter chapter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="block text-gray-700 font-medium">
                  Chapter Content
                </label>
                <div className="relative">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your chapter content here..."
                    className="w-full h-64"
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                    {content.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Add Chapter
                </button>
                <button
                  type="button"
                  onClick={() => {setTitle(''); setContent('');}}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddChapter;
