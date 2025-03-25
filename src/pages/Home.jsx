import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Slider from 'react-slick';
import BookCard from '../components/BookCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '../components/Footer';

function Home() {
  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('${import.meta.env.VITE_API_URL}/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
      setName(decodedToken.name);
      setIsAuthenticated(true);
    }
  }, []);

  const harryPotterBooks = books.filter(book => 
    book.title.toLowerCase().includes('harry potter')
  );

  const mysteryBooks = books.filter(book => book.genre === 'Mystery');
  const fictionBooks = books.filter(book => book.genre === 'Fiction');
  const fantasyBooks = books.filter(book => book.genre === 'Fantasy');

  const sliderSettings = {
    dots: true,
    infinite: harryPotterBooks.length > 3,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    className: "slider-container custom-slider",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e1dcc5] to-[#d1cbb5] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e1dcc5] to-[#d1cbb5]">
      {/* Hero Section */}
      <div
        className="relative h-[600px] bg-cover bg-center bg-fixed mb-12" 
        style={{ 
          backgroundImage: 'url(/src/assets/library.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-sm"></div> 
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center">
          <h1 className="text-7xl font-bold mb-8 text-center text-white animate-fade-in"> 
            {isAuthenticated ? `Welcome back, ${name}!` : 'Welcome to Novely'}
          </h1>
          <p className="text-2xl text-center text-white/90 max-w-2xl leading-relaxed animate-fade-in-delay"> 
            Embark on a journey through countless stories, where every page turns into an adventure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {isAuthenticated && userRole === 'admin' && (
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/20 backdrop-blur-sm border-l-4 border-green-500 p-6 mb-12 rounded-lg shadow-lg">
            <p className="font-medium text-green-800">You are logged in as an administrator</p>
          </div>
        )}

        {/* Collection Section Template */}
        {[
          { title: 'Harry Potter Collection', books: harryPotterBooks, gradient: 'from-purple-500 to-blue-500' },
          { title: 'Mystery Collection', books: mysteryBooks, gradient: 'from-red-500 to-orange-500' },
          { title: 'Fiction Collection', books: fictionBooks, gradient: 'from-blue-500 to-teal-500' },
          { title: 'Fantasy Collection', books: fantasyBooks, gradient: 'from-indigo-500 to-purple-500' }
        ].map((section, index) => (
          <div key={section.title} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="relative">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  {section.title}
                </h2>
                <div className={`h-1 w-24 bg-gradient-to-r ${section.gradient} rounded-full`}></div>
              </div>
              <span className="bg-gradient-to-r ${section.gradient} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {section.books.length} books
              </span>
            </div>
            
            {section.books.length > 0 ? (
              <div className="relative -mx-4 group">
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none"></div>
                <Slider {...{
                  ...sliderSettings,
                  className: "slider-container custom-slider -mx-2",
                }}>
                  {section.books.map(book => (
                    <div key={book._id} className="px-2 transform transition-transform duration-300 hover:scale-105">
                      <BookCard book={book} />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50/50 rounded-xl backdrop-blur-sm">
                <p className="text-gray-600 text-lg">No {section.title.split(' ')[0]} books available at the moment.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Add these styles to your CSS
const styles = `
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fadeIn 0.8s ease-out 0.3s both;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .custom-slider .slick-dots li button:before {
    color: #4B5563;
  }
  
  .custom-slider .slick-dots li.slick-active button:before {
    color: #3B82F6;
  }
`;

export default Home;
