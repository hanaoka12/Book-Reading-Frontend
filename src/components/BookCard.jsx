import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 transition-transform duration-300 hover:scale-105 hover:shadow-xl w-[220px] h-[340px] flex flex-col"> {/* Reduced from w-[280px] h-[380px] */}
      <div className="flex justify-center mb-2">
        <Link to={`/books/${book._id}`}>
          {/* Image dimensions reduced from h-52 w-36 */}
          <img 
            src={book.image?.url || book.image}
            alt={book.title} 
            className="h-44 w-32 object-cover rounded-lg shadow-md transform hover:rotate-3 transition-transform duration-300 cursor-pointer"
            style={{ aspectRatio: '2/3' }}
          />
        </Link>
      </div>
      <div className="flex-grow flex flex-col">
        <h2 className="text-base font-bold text-gray-800 mb-1 line-clamp-2 min-h-[3rem]">{book.title}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">{book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;
