// src/components/Equipment.jsx
import React, { useState, useEffect } from 'react';

const Equipment = () => {
  const [equipmentCategories, setEquipmentCategories] = useState({
    computers: [
      { name: 'PC', stock: 12, eta: '2 days' },
      { name: 'Laptop', stock: 7, eta: '5 days' },
      { name: 'Tablet', stock: 5, eta: '3 days' },
    ],
    furniture: [
      { name: 'Desk', stock: 10, eta: '4 days' },
      { name: 'Chair', stock: 15, eta: '2 days' },
      { name: 'Storage Unit', stock: 3, eta: '7 days' },
    ],
    software: [
      { name: 'Office Suite', stock: 'Unlimited', eta: 'Instant' },
      { name: 'Design Tools', stock: 20, eta: 'Instant' },
      { name: 'Antivirus', stock: 50, eta: 'Instant' },
    ],
    acmeCorp: [ // Assuming 'Client: Acme Corp' category
      { name: 'Custom Laptop', stock: 3, eta: '7 days' },
      { name: 'Premium Desk Chair', stock: 2, eta: '6 days' },
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEquipmentData, setNewEquipmentData] = useState({
    category: '',
    name: '',
    stock: '',
    eta: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // No initial fetch for equipment in the original HTML, so no useEffect here for fetching

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipmentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    const categoryKey = newEquipmentData.category.toLowerCase().replace(/\s+/g, '');
    const equipmentToAdd = {
      name: newEquipmentData.name,
      stock: parseInt(newEquipmentData.stock) || newEquipmentData.stock, // Keep as string if not a number
      eta: newEquipmentData.eta
    };

    try {
      // Replace with your actual API endpoint for adding equipment
      // const res = await fetch('/api/equipment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(equipmentToAdd)
      // });
      // if (res.ok) {
      //   const addedEquipment = await res.json();
      //   // Update state with new equipment
      //   setEquipmentCategories(prevCategories => ({
      //     ...prevCategories,
      //     [categoryKey]: [...(prevCategories[categoryKey] || []), addedEquipment]
      //   }));
      //   alert('Equipment added!');
      // } else {
      //   const err = await res.json();
      //   alert('Error: ' + (err.error || 'Could not add equipment'));
      // }

      // For demonstration, directly add to state and simulate success
      setEquipmentCategories(prevCategories => ({
        ...prevCategories,
        [categoryKey]: [...(prevCategories[categoryKey] || []), equipmentToAdd]
      }));
      alert('Equipment added!');

      setIsModalOpen(false);
      setNewEquipmentData({ category: '', name: '', stock: '', eta: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Function to render categories and filter them by search term
  const renderEquipmentCategories = () => {
    const filteredCategories = {};
    Object.keys(equipmentCategories).forEach(categoryKey => {
      const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Convert camelCase to Title Case
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
      let icon = '📦'; // Default icon
      if (categoryKey === 'computers') icon = '💻';
      else if (categoryKey === 'furniture') icon = '🪑';
      else if (categoryKey === 'software') icon = '🧾';
      else if (categoryKey === 'acmeCorp') icon = '🏢'; // Specific icon for client

      return (
        <div key={categoryKey} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{icon} {title}</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {filteredCategories[categoryKey].map((item, index) => (
              <li key={index}>{item.name} - Stock: {item.stock} - ETA: {item.eta}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Placeholder. This should be a separate shared component. */}
      {/* <aside id="sidebar" className="w-20 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 transition-all duration-300">
        <a href="/">
          <img src="../../assets/logo.png" alt="Logo" />
        </a>
        <nav id="sidebar-nav" className="flex flex-col items-center space-y-6 mt-4 w-full">
          <Link to="/employees" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition">
            <span>👥</span>
            <span className="sidebar-label hidden">Employees</span>
          </Link>
          <Link to="/equipment" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition">
            <span>📦</span>
            <span className="sidebar-label hidden">Equipment</span>
          </Link>
          <Link to="/requests" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition">
            <span>📬</span>
            <span className="sidebar-label hidden">Requests</span>
          </Link>
          // ... other links
        </nav>
      </aside> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar - Placeholder. This should be a separate shared component. */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* <button id="sidebar-toggle" className="text-gray-600 text-xl">☰</button> */}
            <input
              type="text"
              placeholder="Search equipment..."
              className="px-3 py-1 border rounded-md text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

        {/* Equipment Management Section */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Equipment Inventory</h2>
            <button
              id="openEquipmentModalBtn"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Equipment
            </button>
          </div>

          {/* Equipment Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderEquipmentCategories()}
          </div>
        </main>
      </div>

      {/* Add Equipment Modal */}
      {isModalOpen && (
        <div id="addEquipmentModal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Equipment</h2>
            <form onSubmit={handleAddEquipment} className="space-y-3">
              <input
                name="category"
                type="text"
                placeholder="Category (e.g., Computers)"
                required
                className="w-full border rounded px-3 py-2"
                value={newEquipmentData.category}
                onChange={handleInputChange}
              />
              <input
                name="name"
                type="text"
                placeholder="Equipment Name (e.g., PC)"
                required
                className="w-full border rounded px-3 py-2"
                value={newEquipmentData.name}
                onChange={handleInputChange}
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                required
                className="w-full border rounded px-3 py-2"
                value={newEquipmentData.stock}
                onChange={handleInputChange}
              />
              <input
                name="eta"
                type="text"
                placeholder="ETA (e.g., 2 days)"
                required
                className="w-full border rounded px-3 py-2"
                value={newEquipmentData.eta}
                onChange={handleInputChange}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;