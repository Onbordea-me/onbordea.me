import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminNavbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { session } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication and admin status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        if (!session) {
          navigate('/AdminSignin');
          return;
        }
        // Check if the user is an admin
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .single();
        if (adminError || !admin) {
          navigate('/AdminSignin');
          return;
        }
        setIsAdmin(true);
      } catch (err) {
        navigate('/AdminSignin');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [session, navigate]);

  if (loading) {
    return <div className="bg-gray-900 text-gray-400 h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-gray-100 h-screen flex flex-col transition-all duration-300 font-['IBM Plex Sans']`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        {isSidebarOpen && <h2 className="text-lg font-semibold text-teal-400">Admin Panel</h2>}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-teal-400 text-xl"
        >
          {isSidebarOpen ? '◄' : '►'}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2 p-4">
        <Link
          to="/AdminDashboard"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-200 hover:text-teal-400 transition-colors"
        >
          <span>📊</span>
          {isSidebarOpen && <span>Dashboard</span>}
        </Link>
        <Link
          to="/Admin_Equipment"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-200 hover:text-teal-400 transition-colors"
        >
          <span>📦</span>
          {isSidebarOpen && <span>Equipment</span>}
        </Link>
      </nav>
    </div>
  );
};

export default AdminNavbar;