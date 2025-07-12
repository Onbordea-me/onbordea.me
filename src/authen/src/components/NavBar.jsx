import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isSidebarOpen = true, setIsSidebarOpen }) => {
  // Use a variable for sidebar width to avoid Tailwind dynamic class issues
  const sidebarWidth = isSidebarOpen ? "w-48" : "w-20";

  return (
    <aside
      className={`${sidebarWidth} bg-gray-900 text-green-400 flex flex-col py-4 space-y-6 transition-all duration-300 h-screen`}
    >
      <div className="flex justify-center">
        <Link to="/dashboard">
          <img src="/assets/logo.png" alt="Logo" className="w-18 h-12" />
        </Link>
      </div>
      <nav className="flex flex-col items-center space-y-6 mt-4">
        <Link to="/employees" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition">
          <span>👥</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Employees</span>
        </Link>
        <Link to="/equipment" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition">
          <span>📦</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Equipment</span>
        </Link>
        <Link to="/requests" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition">
          <span>📬</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Requests</span>
        </Link>
        <Link to="/analytics" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition">
          <span>📊</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Analytics</span>
        </Link>
        <Link to="/reports" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition">
          <span>🗂️</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Reports</span>
        </Link>
        <Link to="/settings" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition">
          <span>🛰️</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Settings</span>
        </Link>
        <Link to="/support" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition">
          <span>🌐</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Support</span>
        </Link>
      </nav>

      {/* Sidebar toggle button */}
      {setIsSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-green-400 rounded-full p-2 hover:bg-gray-700"
        >
          {isSidebarOpen ? "«" : "»"}
        </button>
      )}
    </aside>
  );
};

export default Navbar;