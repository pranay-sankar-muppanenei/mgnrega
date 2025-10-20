// client/src/components/Loader.jsx
import React from 'react';

const Loader = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-gray-300 mt-4 text-lg">{message}</p>
    </div>
  );
};

export default Loader;