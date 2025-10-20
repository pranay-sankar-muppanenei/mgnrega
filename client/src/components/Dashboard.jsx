// client/src/pages/Dashboard.jsx (Revised to manage District list state)
import React, { useState, useEffect } from 'react';
import DistrictSelector from '../components/DistrictSelector'; 
import PerformanceChart from '../components/PerformanceChart';
import Loader from '../components/Loader'; // Assuming you created this

const Dashboard = () => {
  const [district, setDistrict] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Performance data loading state
  const [districtsList, setDistrictsList] = useState([]); // List of districts
  const [isListLoading, setIsListLoading] = useState(true); // District list loading state

  // Effect 1: Fetch the list of districts for the selector (MOVED HERE)
  useEffect(() => {
    setIsListLoading(true);
// ✅ Correct way for Vite (using a Vite-compatible name)
fetch(`${import.meta.env.VITE_API_URL}/api/districts`)
      .then(res => res.json())
      .then(data => {
        setDistrictsList(data);
      })
      .catch(err => {
        console.error('Error fetching districts list:', err);
        setDistrictsList([]);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  }, []);


  // Effect 2: Fetch performance data when a district is selected (Original logic)
  useEffect(() => {
    if (district) {
      setPerformanceData(null); 
      setIsLoading(true); 
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/district/${district}/performance`)
        .then(res => res.json())
        .then(data => {
          setPerformanceData(data);
        })
        .catch(err => {
            console.error('Error fetching performance data:', err);
            setPerformanceData({ performance: [] }); 
        })
        .finally(() => {
            setIsLoading(false); 
        });
    } else {
        setPerformanceData(null);
    }
  }, [district]);

  // --- Render Logic ---

  let content;

  if (isListLoading) {
    content = <Loader message="Connecting to database and fetching district list..." />;
  } else if (!district) {
    content = (
      <p className="text-gray-300 text-lg mt-10">
        Please select a district to view performance data.
      </p>
    );
  } else if (isLoading) {
    content = <Loader message={`Fetching performance for ${district}...`} />;
  } else if (performanceData && performanceData.performance.length > 0) {
    content = (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl">
        <PerformanceChart data={performanceData} />
      </div>
    );
  } else {
    content = (
        <p className="text-gray-300 text-lg mt-10">
            No detailed performance data found for **{district}**.
        </p>
    );
  }


  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        MGNREGA Dashboard 📊
      </h1>

      <div className="mb-8 w-full max-w-xs">
        {/* PASS THE LIST AND THE LOADING STATE DOWN */}
        <DistrictSelector 
            districtsList={districtsList} // New Prop
            setDistrict={setDistrict} 
            isLoading={isListLoading}     // New Prop
        />
      </div>

      {content}
      
    </div>
  );
};

export default Dashboard;