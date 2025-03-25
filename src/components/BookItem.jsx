import React from 'react';
import { Link } from 'react-router-dom';

function BookItem({ book, query }) {
  // Function to highlight search terms in the book title
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <Link to={`/books/${book._id}`} className="block">
        <img
          src={book.image?.url || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={book.title || 'Book Image'}
          className="w-full h-64 object-cover rounded"
          loading="lazy"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {highlightText(book.title, query)}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Author: {book.author || 'Unknown'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Category: {book.genre || 'Uncategorized'}</p>
          {book.rating && (
            <div className="flex items-center mt-2">
              <span className="text-yellow-500 flex">
                {/* Star Icons */}
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.175 0l-3.377 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.98 9.393c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.966z" />
                  </svg>
                ))}
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {book.rating} / 5
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-4 text-center">
        <Link to={`/books/${book._id}`}>
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
            View Details
          </button>
        </Link>
      </div>
    </li>
  );
}

export default BookItem;