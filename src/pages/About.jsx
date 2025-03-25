// Create a new file named About.jsx in your pages directory

import React from 'react';
import { FaBookOpen, FaUsers, FaCompass } from 'react-icons/fa';
import { useEffect } from 'react';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-[#e1dcc5]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(/src/assets/aboutbanner.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Novely</h1>
          <p className="text-xl text-white text-center max-w-2xl">
            Discover the story behind Novely and our passion for books.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Our Mission */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="/src/assets/ourmission.jpg"
              alt="Our Mission"
              className="rounded-lg shadow-lg h-80 w-full object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <FaCompass className="text-blue-600" />
              Our Mission
            </h2>
            <p className="text-lg text-gray-700">
              At Novely, our mission is to connect readers with amazing books and authors. We believe in the transformative power of literature and aim to create a community where stories thrive.
            </p>
          </div>
        </div>

        {/* Our Team */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 md:order-2">
            <img
              src="/src/assets/ourteam.png"
              alt="Our Team"
              className="rounded-lg shadow-lg h-80 w-full object-cover"
            />
          </div>
          <div className="md:w-1/2 md:order-1">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-600" />
              Our Team
            </h2>
            <p className="text-lg text-gray-700">
              We are a group of book enthusiasts who are passionate about sharing the joy of reading. Our team works tirelessly to bring you the best selection of books and an exceptional user experience.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Novely</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <FaBookOpen className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Vast Collection</h3>
              <p className="text-gray-700">
                Explore a wide range of genres and find books that resonate with you.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <FaUsers className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-700">
                Join a community of like-minded readers and share your thoughts.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <FaCompass className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-gray-700">
                Get book suggestions tailored to your interests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;