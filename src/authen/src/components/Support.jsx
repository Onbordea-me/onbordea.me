import React, { useState } from 'react';
import Navbar from './Navbar';

const Support = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-gray-900 text-gray-100">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-md">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search support..."
              className="px-3 py-1 border border-gray-600 rounded-md bg-gray-700 text-gray-100 text-sm focus:outline-none focus:border-teal-500"
            />
            <button className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 text-sm">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm text-gray-200">Dominic Keller</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          <h2 className="text-xl font-semibold text-teal-400 mb-6">Support Center</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 bg-gray-900 rounded-lg shadow p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Live Chat</h3>
              <div className="h-60 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-700 space-y-2 text-sm text-gray-200">
                <div className="text-left text-teal-400"><strong>You:</strong> Hello, I need help with a delivery.</div>
                <div className="text-right text-teal-300"><strong>Support:</strong> Sure, let me check that for you.</div>
              </div>
              <div className="flex mt-2 space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-600 rounded px-2 py-1 bg-gray-700 text-gray-100 text-sm focus:outline-none focus:border-teal-500"
                />
                <button className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 text-sm">Send</button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Submit a Ticket</h3>
              <form className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-600 px-2 py-1 rounded bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300">Issue</label>
                  <textarea
                    className="w-full border border-gray-600 px-2 py-1 rounded bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                    rows="4"
                    placeholder="Describe your issue..."
                  ></textarea>
                </div>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Support;