import React, { useState } from 'react';
import Navbar from './Navbar';

const Requests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-gray-900 text-gray-100">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-md">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-teal-400">Service Requests</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm text-gray-200">Dominic Keller</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full max-w-md p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">📦 New Equipment Request</h3>
              <p className="text-gray-400 mb-4">Request new delivery hardware or tools.</p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Request</button>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">🔁 Equipment Change Request</h3>
              <p className="text-gray-400 mb-4">Swap or upgrade your existing equipment.</p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Request</button>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">📤 Equipment Return (Offboarding)</h3>
              <p className="text-gray-400 mb-4">Return devices during offboarding.</p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Request</button>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">🛠️ On-Demand Support Request</h3>
              <p className="text-gray-400 mb-4">Get help for any immediate logistics issues.</p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Request</button>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">📷 Upload Photos / Docs</h3>
              <p className="text-gray-400 mb-4">Submit required images or paperwork for a request.</p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Request</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Requests;