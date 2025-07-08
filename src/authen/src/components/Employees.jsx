import { useState } from 'react';import { Link } from 'react-router-dom';


const initialEmployees = [
  {
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    position: 'Software Engineer',
    location: 'Remote',
    equipment: ['PC', 'Software License'],
  },
  {
    name: 'John Baker',
    email: 'john.baker@example.com',
    position: 'HR Manager',
    location: 'Office',
    equipment: ['Desk', 'Phone'],
  },
  {
    name: 'Catherine Taylor',
    email: 'catherine.taylor@example.com',
    position: 'Marketing Lead',
    location: 'Hybrid',
    equipment: ['Laptop', 'Mouse'],
  },
];

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    location: '',
    equipment: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      ...formData,
      equipment: formData.equipment
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setEmployees([...employees, newEmployee]);
    setFormData({ name: '', email: '', position: '', location: '', equipment: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-black">
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`w-${isSidebarOpen ? '48' : '20'} bg-gray-900 text-green-400 flex flex-col items-center py-4 space-y-6 transition-all duration-300`}
      >
        <Link to="/Dashboard" className="flex items-center justify-center">
          <img src="/assets/logo.png" alt="Logo" className="w-12 h-12" />
        </Link>
        <nav id="sidebar-nav" className="flex flex-col items-center space-y-6 mt-4 w-full">
          <Link to="/employees" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition px-4 w-full justify-start">
            <span>👥</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Employees</span>
          </Link>
          <a href="equipment.html" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition px-4 w-full justify-start">
            <span>📦</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Equipment</span>
          </a>
          <a href="requests.html" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition px-4 w-full justify-start">
            <span>📬</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Requests</span>
          </a>
          <a href="analytics.html" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition px-4 w-full justify-start">
            <span>📊</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Analytics</span>
          </a>
          <a href="reports.html" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition px-4 w-full justify-start">
            <span>🗂️</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Reports</span>
          </a>
          <a href="settings.html" className="flex items-center space-x-2 py-1 rounded hover:bg-green-900 transition px-4 w-full justify-start">
            <span>🛰️</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Settings</span>
          </a>
          <a href="support.html" className="flex items-center space-x-2 py-1 rounded hover:bg-blue-900 transition px-4 w-full justify-start">
            <span>🌐</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Support</span>
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 text-xl">☰</button>
            <input
              type="text"
              placeholder="Search employees..."
              className="px-3 py-1 border rounded-md text-sm focus:outline-none"
            />
            <button className="bg-indigo-500 text-white px-4 py-1 rounded text-sm">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="text-sm">Dominic Keller</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Employees Management</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
            >
              Register New Employee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-center space-x-4 mb-2">
                  <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{emp.name}</h3>
                    <p className="text-sm text-gray-600">
                      <a href={`mailto:${emp.email}`}>{emp.email}</a>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Position:</strong> {emp.position}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> {emp.location}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Assigned Equipment:</strong>
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {emp.equipment.map((eq, i) => (
                    <li key={i}>{eq}</li>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Register New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Full Name"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                type="text"
                placeholder="Position"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
                placeholder="Location"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                type="text"
                placeholder="Assigned Equipment (comma separated)"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
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
}
