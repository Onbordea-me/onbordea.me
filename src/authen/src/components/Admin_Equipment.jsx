import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminNavbar from './Admin_Navbar';

const AdminEquipment = () => {
  const { session } = UserAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [equipmentCategories, setEquipmentCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEquipmentData, setNewEquipmentData] = useState({
    category: '',
    name: '',
    stock: '',
    eta: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch equipment and check admin status on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check authentication
        if (!session) {
          navigate('/AdminSignin');
          return;
        }

        // Check if user is admin
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .single();
        if (adminError || !admin) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }

        // Fetch equipment
        const { data: equipmentData, error: equipmentError } = await supabase.from('equipment').select('*');
        if (equipmentError) throw equipmentError;

        // Group equipment by category
        const groupedData = equipmentData.reduce((acc, item) => {
          const categoryKey = item.category.toLowerCase().replace(/\s+/g, '');
          acc[categoryKey] = acc[categoryKey] || [];
          acc[categoryKey].push({ id: item.id, name: item.name, stock: item.stock, eta: item.eta });
          return acc;
        }, {});
        setEquipmentCategories(groupedData);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipmentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Error: Only admins can add equipment.');
      return;
    }
    const categoryKey = newEquipmentData.category.toLowerCase().replace(/\s+/g, '');
    const equipmentToAdd = {
      category: newEquipmentData.category,
      name: newEquipmentData.name,
      stock: parseInt(newEquipmentData.stock) || newEquipmentData.stock,
      eta: newEquipmentData.eta
    };

    try {
      const { data, error } = await supabase.from('equipment').insert([equipmentToAdd]).select();
      if (error) throw error;

      setEquipmentCategories(prevCategories => ({
        ...prevCategories,
        [categoryKey]: [...(prevCategories[categoryKey] || []), { id: data[0].id, ...equipmentToAdd }]
      }));
      alert('Equipment added!');
      setIsModalOpen(false);
      setNewEquipmentData({ category: '', name: '', stock: '', eta: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const renderEquipmentCategories = () => {
    if (loading) return <div className="text-center text-gray-400">Loading...</div>;
    if (error) return <div className="text-center text-red-400">Error: {error}</div>;

    const filteredCategories = {};
    Object.keys(equipmentCategories).forEach(categoryKey => {
      const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const filteredItems = equipmentCategories[categoryKey].filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filteredCategories[categoryKey] = filteredItems;
      }
    });

    return Object.keys(filteredCategories).map(categoryKey => {
      let title = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let icon = '📦';
      if (categoryKey === 'computers') icon = '💻';
      else if (categoryKey === 'furniture') icon = '🪑';
      else if (categoryKey === 'software') icon = '🧾';
      else if (categoryKey === 'acmeCorp') icon = '🏢';

      return (
        <div key={categoryKey} className="bg-gray-900 border border-gray-700 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-teal-400 mb-2">{icon} {title}</h3>
          <ul className="text-sm text-gray-200 space-y-1">
            {filteredCategories[categoryKey].map((item) => (
              <li key={item.id}>{item.name} - Stock: {item.stock} - ETA: {item.eta}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-gray-900 text-gray-100">
      <AdminNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-md">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search equipment..."
              className="px-3 py-1 border border-gray-600 rounded-md text-sm focus:outline-none bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm text-gray-200">{session?.user?.email || 'Admin'}</span>
              <button
                onClick={async () => {
                  await session?.signOutUser();
                  navigate('/AdminSignin');
                }}
                className="text-purple-400 hover:text-purple-500 text-xs"
              >
                (Sign Out)
              </button>
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-teal-400">Equipment Inventory</h2>
            {isAdmin && (
              <button
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                Add New Equipment
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderEquipmentCategories()}
          </div>
        </main>
      </div>
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-teal-400">Add New Equipment</h2>
            <div className="space-y-4">
              <input
                name="category"
                type="text"
                placeholder="Category (e.g., Computers)"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                value={newEquipmentData.category}
                onChange={handleInputChange}
              />
              <input
                name="name"
                type="text"
                placeholder="Equipment Name (e.g., PC)"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                value={newEquipmentData.name}
                onChange={handleInputChange}
              />
              <input
                name="stock"
                type="text"
                placeholder="Stock (e.g., 10 or Unlimited)"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                value={newEquipmentData.stock}
                onChange={handleInputChange}
              />
              <input
                name="eta"
                type="text"
                placeholder="ETA (e.g., 2 days)"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
                value={newEquipmentData.eta}
                onChange={handleInputChange}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEquipment}
                  className="px-4 py-1 rounded bg-teal-600 text-white hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEquipment;