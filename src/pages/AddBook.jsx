import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { useDropzone } from 'react-dropzone'; // Install with: npm install react-dropzone

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 
    'Fantasy', 'Romance', 'Thriller', 'Horror', 'Biography', 
    'History', 'Poetry', 'Other'
  ];

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select an image under 10MB');
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        };

        const compressedFile = await imageCompression(file, options);
        setSelectedImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Error processing image. Please try another file.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('description', description);
      formData.append('genre', genre);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('${import.meta.env.VITE_API_URL}/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add book');
      }

      alert('Book added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || 'An error occurred while adding the book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e1dcc5] py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-[#7c98b3] py-6 px-8"> {/* Changed from bg-blue-500 to a muted blue-gray */}
            <h1 className="text-3xl font-bold text-white text-center">Add New Book</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Genre *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              >
                <option value="">Select a genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image *</label>
              <div {...getRootProps()} className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
              `}>
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      {isDragActive ? 
                        'Drop the image here...' : 
                        'Drag & drop an image here, or click to select'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`
                w-full py-3 px-4 rounded-lg text-white font-medium
                transition-all duration-300 transform hover:scale-[1.02]
                ${loading ? 
                  'bg-blue-400 cursor-not-allowed' : 
                  'bg-blue-500 hover:bg-blue-600 active:scale-[0.98]'
                }
              `}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Adding Book...
                </div>
              ) : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
