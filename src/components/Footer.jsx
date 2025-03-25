import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa';

const categories = ['Mystery', 'Fiction', 'Fantasy', 'Non-Fiction', 'Romance', 'Sci-Fi'];

function Footer({ isAuthenticated }) {
  return (
    <footer className="bg-[#e1dcc5] text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Site Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/src/assets/novel.png" alt="Novely Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold">Novely</span>
            </div>
            <p>
              Your personal library for discovering and reading amazing books.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              {isAuthenticated && (
                <li><Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link></li>
              )}
            </ul>
          </div>
          
          {/* Genres */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link 
                    to={`/category/${encodeURIComponent(category)}?page=1`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <p className="mb-4">We'd love to hear from you!</p>
            <p>Email: <a href="mailto:novely@gmail.com" className="hover:text-blue-600">novely@gmail.com</a></p>
            <p>Phone: <a href="tel:+1234567890" className="hover:text-blue-600">+1 (234) 567-890</a></p>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/profile.php?id=100010992677742" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                <FaFacebookF size={24} />
              </a>
              <a href="https://www.instagram.com/namdo1612/" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
              <a href="https://github.com/hanaoka12" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} />
              </a>
            </div>
          </div>

        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-300 pt-8 text-center">
          &copy; {new Date().getFullYear()} Novely. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;