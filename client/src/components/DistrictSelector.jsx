// client/src/components/DistrictSelector.jsx (Updated)
import React from 'react';

// Accept the props for the list, the selector function, and the loading state
const DistrictSelector = ({ setDistrict, districtsList, isLoading }) => {
  
  const handleChange = (e) => {
    setDistrict(e.target.value);
  };

  // If loading, display a disabled selector with a loading message
  if (isLoading) {
    return (
      <select
        className="bg-gray-700 text-gray-400 px-4 py-2 rounded-md shadow-md cursor-wait w-full"
        disabled
      >
        <option value="">Loading Districts...</option>
      </select>
    );
  }

  // If not loading but the list is empty (fetch error), display an error message
  if (districtsList.length === 0) {
    return (
        <select
            className="bg-gray-700 text-red-400 px-4 py-2 rounded-md shadow-md cursor-not-allowed w-full"
            disabled
        >
            <option value="">Error Loading Districts</option>
        </select>
    );
  }

  // Normal rendering
  return (
    <select
      onChange={handleChange}
      className="bg-white text-black px-4 py-2 rounded-md shadow-md focus:ring-2 focus:ring-blue-400 w-full"
    >
      <option value="">Select District</option>
      {districtsList.map((district, index) => (
        <option key={index} value={district}>
          {district}
        </option>
      ))}
    </select>
  );
};

export default DistrictSelector;