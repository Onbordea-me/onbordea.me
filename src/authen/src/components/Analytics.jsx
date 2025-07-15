import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample data for charts (to be replaced with real data from Supabase or API)
  const ticketDistributionData = {
    labels: ['Onboarding', 'Offboarding', 'Maintenance'],
    datasets: [
      {
        label: 'Tickets (%)',
        data: [45, 30, 25],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const resolutionTimeData = {
    labels: ['0-1 Day', '1-3 Days', '3-7 Days', '10+ Days'],
    datasets: [
      {
        label: 'Tickets',
        data: [80, 65, 20, 60],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const costByDepartmentData = {
    labels: ['Sales', 'Ops', 'Returns'],
    datasets: [
      {
        label: 'Cost ($)',
        data: [2450, 3110, 1030],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-15' : 'ml-5'}`}>
        <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
              Search
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="text-sm">Dominic Keller</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Analytics Dashboard</h1>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">📊</span>
                <h2 className="text-lg font-semibold">Total Tickets</h2>
              </div>
              <p className="text-4xl font-bold text-white mt-2">185</p>
              <p className="text-sm text-gray-400 mt-1">Last 30 Days</p>
            </div>
            <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✅</span>
                <h2 className="text-lg font-semibold">Completed Tickets</h2>
              </div>
              <p className="text-4xl font-bold text-white mt-2">162</p>
              <p className="text-sm text-gray-400 mt-1">Resolution Rate: 87.5%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">⏳</span>
                <h2 className="text-lg font-semibold">Avg. Resolution Time</h2>
              </div>
              <p className="text-4xl font-bold text-white mt-2">3.5 days</p>
              <p className="text-sm text-gray-400 mt-1">All Ticket Types</p>
            </div>
            <div className="bg-gradient-to-br from-purple-700 to-purple-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-3">
                <span className="text-purple-400">📈</span>
                <h2 className="text-lg font-semibold">Growth Rate</h2>
              </div>
              <p className="text-4xl font-bold text-white mt-2">+12%</p>
              <p className="text-sm text-gray-400 mt-1">New Employees (YoY)</p>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">🎯 Ticket Distribution</h2>
              <Bar data={ticketDistributionData} options={chartOptions} />
              <button className="mt-4 text-indigo-400 hover:text-indigo-300 underline text-sm">
                View Details
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">⏱️ Resolution Time</h2>
              <Bar data={resolutionTimeData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">💰 Cost by Department</h2>
              <Bar data={costByDepartmentData} options={chartOptions} />
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">⭐ User Feedback</h2>
              <div className="space-y-2">
                <p>NPS Score: <span className="text-green-400 font-semibold">+62</span></p>
                <p>Avg. Rating: <span className="text-yellow-400">4.3 / 5</span></p>
                <p>Feedback Submissions: <span className="text-gray-300">238</span></p>
              </div>
              <button className="mt-4 text-indigo-400 hover:text-indigo-300 underline text-sm">
                View Feedback
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;