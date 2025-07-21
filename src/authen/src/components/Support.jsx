import React, { useState } from 'react';
import Navbar from './Navbar'; // Assuming Navbar.jsx is in the same directory

const Support = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  return (
    <div className="flex h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* The toggle button is now part of the Navbar component */}
            <input type="text" placeholder="Search support..." className="px-3 py-1 border rounded-md text-sm focus:outline-none" />
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
          <h2 className="text-xl font-semibold text-white-800 mb-6">Support Center</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="col-span-1 lg:col-span-2 bg-black rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-white-800 mb-2">Live Chat</h3>
              <div className="h-60 overflow-y-auto border rounded p-2 bg-gray-50 space-y-2 text-sm">
                <div className="text-left text-blue-800"><strong>You:</strong> Hello, I need help with a delivery.</div>
                <div className="text-right text-blue-700"><strong>Support:</strong> Sure, let me check that for you.</div>
              </div>
              <div className="flex mt-2 space-x-2">
                <input type="text" placeholder="Type a message..." className="flex-1 border rounded px-2 py-1 text-sm" />
                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">Send</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Submit a Ticket</h3>
              <form className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input type="email" className="w-full border px-2 py-1 rounded" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-gray-700">Issue</label>
                  <textarea className="w-full border px-2 py-1 rounded" rows="4" placeholder="Describe your issue..."></textarea>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Support;