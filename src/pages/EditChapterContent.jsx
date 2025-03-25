import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';


const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet',
  'link', 'image'
];

function EditChapterContent() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { bookId, chapterNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapters/${chapterNumber}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error fetching chapter');
        }
        const data = await response.json();
        setContent(data.content);
        setTitle(data.title);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Error fetching chapter');
        setLoading(false);
      }
    };
    fetchChapter();
  }, [bookId, chapterNumber]);

  const getWordCount = (htmlContent) => {
    const text = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [] });
    return text.split(/\s+/).filter(Boolean).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to save these changes?');
    
    if (!isConfirmed) {
      return; // Exit if user cancels
    }

    // Sanitize the content
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapters/${chapterNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content: sanitizedContent })
      });

      if (response.ok) {
        alert('Changes saved successfully!');
        navigate(`/edit-chapters/${bookId}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update chapter');
      }
    } catch (error) {
      setError('Error updating chapter');
    }
  };

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => navigate(`/edit-chapters/${bookId}`)}
            className="mt-4 text-sm text-red-600 hover:text-red-800"
          >
            ← Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#7c98b3] py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Edit Chapter {chapterNumber}
            </h1>
          </div>

        
          <div className="p-8">
          
            <nav className="mb-6 text-sm">
              <Link 
                to={`/edit-chapters/${bookId}`} 
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                ← Back to Chapters List
              </Link>
            </nav>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  placeholder="Enter chapter title..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Chapter Content
                </label>
                <div className="relative">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your chapter content here..."
                    className="w-full h-64"
                    modules={modules}
                    formats={formats}
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                    {getWordCount(content)} words
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/edit-chapters/${bookId}`)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChapterContent;