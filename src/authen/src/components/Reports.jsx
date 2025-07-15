import React, { useState } from 'react';
import Navbar from './Navbar'; 

const Reports = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  return (
    <div className="flex h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* The toggle button is now part of the Navbar component */}
            <input type="text" placeholder="Search reports..." className="px-3 py-1 border rounded-md text-sm focus:outline-none" />
            <button className="bg-indigo-500 text-white px-4 py-1 rounded text-sm">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm">Dominic Keller</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Reports Dashboard</h2>
            <div className="space-x-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Download Excel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">Download PDF</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Monthly Cost Report</h3>
              <p className="text-sm text-gray-600">Breakdown by department:</p>
              <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                <li>Engineering - $4,200</li>
                <li>HR - $1,300</li>
                <li>Marketing - $2,750</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery & Pickup Times</h3>
              <p className="text-sm text-gray-600">Average duration (in days):</p>
              <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                <li>Delivery: 3.2 days</li>
                <li>Pickup: 2.4 days</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">User Satisfaction</h3>
              <p className="text-sm text-gray-600">Last Month:</p>
              <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                <li>NPS Score: 45</li>
                <li>Avg Rating: ⭐️⭐️⭐️⭐️ (4.1)</li>
                <li>Feedback: "Fast and friendly delivery!"</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;