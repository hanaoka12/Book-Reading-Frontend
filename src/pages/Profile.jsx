import React, { useState, useEffect } from 'react';
import { AiFillHeart } from 'react-icons/ai'; // Importing heart icon
import { Link } from 'react-router-dom'; // Ensure Link is imported

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUserProfile();
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
      setUser(data);
      setNewName(data.name);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/profile/update-name', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        setUser(prev => ({ ...prev, name: newName }));
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB check
        alert('File size must be less than 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/profile/update-avatar', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(prev => ({ ...prev, avatar: data.avatar }));
        } else {
          console.error('Upload failed:', data);
          alert(data.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error details:', error);
        alert('Error uploading image');
      }
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-[#e1dcc5] to-[#d1cbb5] flex items-center justify-center">
      <div className="animate-pulse text-xl text-gray-700 font-medium">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e1dcc5] to-[#d1cbb5] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 relative">
          My Profile
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        </h1>
        
        <div className="mb-12 text-center">
          <div className="relative w-48 h-48 mx-auto mb-6 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <img 
              src={user.avatar?.url} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-white transition-all duration-300 group-hover:scale-105"
            />
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label 
              htmlFor="avatar-upload"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 transform bg-black/80 hover:bg-black text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-sm"
            >
              Change Avatar
            </label>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-inner">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              {!isEditingName ? (
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-medium text-gray-800 transition-all duration-300">
                    {user.name}
                  </h2>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Edit Name
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white/90"
                    placeholder="Enter new name"
                  />
                  <button 
                    onClick={handleUpdateName}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-base text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <span className="font-medium text-gray-700">Username:</span> {user.username}
          </div>

          <div className="flex justify-center">
            <Link to="/favorites" className="group">
              <button className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
                <AiFillHeart className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                My Favorites
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;