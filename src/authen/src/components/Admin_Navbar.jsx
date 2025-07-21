import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ isSidebarOpen = true, setIsSidebarOpen }) => {
  const sidebarWidth = isSidebarOpen ? 'w-56' : 'w-16'; // Wider sidebar when open

  return (
    <aside
      className={`${sidebarWidth} bg-gray-950 text-orange-500 flex flex-col py-6 space-y-8 transition-all duration-300 h-screen shadow-lg`}
    >
      <div className="flex justify-center">
        <Link to="/admin">
          <img src="/assets/admin-logo.png" alt="Admin Logo" className="w-20 h-14" />
        </Link>
      </div>
      <nav className="flex flex-col items-center space-y-8 mt-6">
        <Link to="/admin/tickets" className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-orange-900 transition">
          <span>🎫</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-md font-medium`}>Tickets</span>
        </Link>
        <Link to="/admin/equipment" className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-orange-900 transition">
          <span>🔧</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-md font-medium`}>Equipment</span>
        </Link>
        <Link to="/admin/settings" className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-orange-900 transition">
          <span>⚙️</span>
          <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-md font-medium`}>Settings</span>
        </Link>
      </nav>

      {/* Sidebar toggle button */}
      {setIsSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-orange-500 rounded-full p-3 hover:bg-gray-700"
        >
          {isSidebarOpen ? "«" : "»"}
        </button>
      )}
    </aside>
  );
};

export default AdminNavbar;