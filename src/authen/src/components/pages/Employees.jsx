// src/components/Employees.jsx
import React, { useState, useEffect } from 'react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    email: '',
    position: '',
    location: '',
    equipment: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees on component mount
  useEffect(() => {
    // In a real application, you'd fetch this from your backend
    // For now, using mock data or an empty array
    const mockEmployees = [
      { name: 'Alice Brown', email: 'alice.brown@example.com', position: 'Software Engineer', location: 'Remote', equipment: ['PC', 'Software License'] },
      { name: 'John Baker', email: 'john.baker@example.com', position: 'HR Manager', location: 'Office', equipment: ['Desk', 'Phone'] },
      { name: 'Catherine Taylor', email: 'catherine.taylor@example.com', position: 'Marketing Lead', location: 'Hybrid', equipment: ['Laptop', 'Mouse'] },
    ];
    setEmployees(mockEmployees);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const equipmentArray = newEmployeeData.equipment.split(',').map(item => item.trim()).filter(Boolean);
    const employeeToAdd = { ...newEmployeeData, equipment: equipmentArray };

    try {
      // Replace with your actual API endpoint for adding employees
      // const res = await fetch('/api/employees', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(employeeToAdd)
      // });
      // if (res.ok) {
      //   const addedEmployee = await res.json();
      //   setEmployees(prevEmployees => [...prevEmployees, addedEmployee]);
      //   alert('Employee added successfully!');
      // } else {
      //   const err = await res.json();
      //   alert('Error: ' + (err.error || 'Could not add employee'));
      // }

      // For demonstration, directly add to state and simulate success
      setEmployees(prevEmployees => [...prevEmployees, employeeToAdd]);
      alert('Employee added successfully!');

      setIsModalOpen(false);
      setNewEmployeeData({ name: '', email: '', position: '', location: '', equipment: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search employees..."
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

        {/* Employee Management Section */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Employees Management</h2>
            <button
              id="openModalBtn"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Register New Employee
            </button>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                    <p className="text-sm text-gray-600">
                      <a href={`mailto:${employee.email}`}>{employee.email}</a>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700"><strong>Position:</strong> {employee.position}</p>
                <p className="text-sm text-gray-700"><strong>Location:</strong> {employee.location}</p>
                <p className="text-sm text-gray-700 mt-2"><strong>Assigned Equipment:</strong></p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {employee.equipment && employee.equipment.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <button className="bg-red-500 text-white mt-4 px-3 py-1 rounded hover:bg-red-600 text-sm">
                  Deregister Employee
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div id="addEmployeeModal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Register New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                className="w-full border rounded px-3 py-2"
                value={newEmployeeData.name}
                onChange={handleInputChange}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full border rounded px-3 py-2"
                value={newEmployeeData.email}
                onChange={handleInputChange}
              />
              <input
                name="position"
                type="text"
                placeholder="Position"
                required
                className="w-full border rounded px-3 py-2"
                value={newEmployeeData.position}
                onChange={handleInputChange}
              />
              <input
                name="location"
                type="text"
                placeholder="Location"
                required
                className="w-full border rounded px-3 py-2"
                value={newEmployeeData.location}
                onChange={handleInputChange}
              />
              <input
                name="equipment"
                type="text"
                placeholder="Assigned Equipment (comma separated)"
                className="w-full border rounded px-3 py-2"
                value={newEmployeeData.equipment}
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

export default Employees;