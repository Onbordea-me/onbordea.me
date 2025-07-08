import React, { useState } from 'react';
import Navbar from './Navbar'; // Assuming NavBar.jsx is in the same directory

const Requests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  return (
    <div className="flex h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-48' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* The toggle button is now part of the Navbar component */}
            <h1 className="text-lg font-semibold">Service Requests</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm">Dominic Keller</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <input type="text" placeholder="Search requests..." className="w-full max-w-md p-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-blue-100 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">📦 New Equipment Request</h3>
              <p className="text-gray-600 mb-4">Request new delivery hardware or tools.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Request</button>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">🔁 Equipment Change Request</h3>
              <p className="text-gray-600 mb-4">Swap or upgrade your existing equipment.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Request</button>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">📤 Equipment Return (Offboarding)</h3>
              <p className="text-gray-600 mb-4">Return devices during offboarding.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Request</button>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">🛠️ On-Demand Support Request</h3>
              <p className="text-gray-600 mb-4">Get help for any immediate logistics issues.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Request</button>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">📷 Upload Photos / Docs</h3>
              <p className="text-gray-600 mb-4">Submit required images or paperwork for a request.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Request</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Requests;