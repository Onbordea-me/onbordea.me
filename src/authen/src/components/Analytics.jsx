// src/components/Analytics.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Analytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle
  return (
    <div className="flex h-screen">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar - Placeholder for your shared Navbar Component */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* <button id="sidebar-toggle" className="text-gray-600 text-xl">☰</button> */}
            <input type="text" placeholder="Search..." className="px-3 py-1 border rounded-md text-sm focus:outline-none" />
            <button className="bg-indigo-500 text-white px-4 py-1 rounded text-sm">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="flex items-center space-x-2">
              {/* <img src="https://via.placeholder.com/30" className="rounded-full" alt="User Avatar" /> */}
              <span className="text-sm">Dominic Keller</span>
            </span>
          </div>
        </header>

        {/* Analytics Dashboard Section */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Analytics Dashboard</h1>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">📊 Total Tickets</h2>
              <p className="text-3xl font-bold text-gray-900">185</p>
              <p className="text-sm text-gray-600">Last 30 Days</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">✅ Completed Tickets</h2>
              <p className="text-3xl font-bold text-green-600">162</p>
              <p className="text-sm text-gray-600">Resolution Rate: 87.5%</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">⏳ Average Resolution Time</h2>
              <p className="text-3xl font-bold text-blue-600">3.5 days</p>
              <p className="text-sm text-gray-600">All Ticket Types</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">📈 Growth Rate</h2>
              <p className="text-3xl font-bold text-purple-600">+12%</p>
              <p className="text-sm text-gray-600">New Employees (YoY)</p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-md col-span-full xl:col-span-1">
              <h2 className="text-lg font-semibold mb-2">⚙️ Ticket Distribution by Type</h2>
              {/* This would ideally be a chart, but we'll represent it with text for now */}
              <ul className="text-sm space-y-1">
                <li>Onboarding: 45%</li>
                <li>Offboarding: 30%</li>
                <li>Maintenance: 25%</li>
              </ul>
              <button className="mt-3 text-xs text-indigo-600 underline hover:text-indigo-500">View Details</button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">⏱️ Resolution Time Buckets</h2>
              <table className="w-full text-sm mt-2">
                <thead className="text-gray-500 border-b">
                  <tr><th>Time Bucket</th><th>Tickets</th><th>%</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td>0-1 Day</td><td>80</td><td>43%</td></tr>
                  <tr className="border-b"><td>1-3 Days</td><td>65</td><td>35%</td></tr>
                  <tr className="border-b"><td>3-7 Days</td><td>20</td><td>11%</td></tr>
                  <tr><td>10+ Days</td><td>60</td><td>6%</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">💰 Cost by Department</h2>
              <table className="w-full text-sm mt-2">
                <thead className="text-gray-500 border-b">
                  <tr><th>Department</th><th>Cost ($)</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td>Sales</td><td>$2,450</td></tr>
                  <tr className="border-b"><td>Ops</td><td>$3,110</td></tr>
                  <tr><td>Returns</td><td>$1,030</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-2">⭐ User Feedback</h2>
              <ul className="text-sm space-y-1">
                <li>NPS Score: <span className="font-semibold text-green-600">+62</span></li>
                <li>Average Rating: <span className="font-medium">4.3 / 5</span></li>
                <li>Feedback Submissions: <span className="font-medium">238</span></li>
              </ul>
              <button className="mt-3 text-xs text-indigo-600 underline hover:text-indigo-500">View Feedback</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Analytics;