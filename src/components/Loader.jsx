import React from 'react';

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#e1dcc5] dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-center text-blue-600 dark:text-blue-400 font-semibold">
        Loading...
      </p>
    </div>
  );
}

export default Loader;