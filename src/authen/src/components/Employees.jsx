import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 
import Navbar from './Navbar';
import { Link } from 'react-router-dom';


export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    location: '',
    equipment: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState('Loading...');

  // Helper to fetch employees
  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (!error) setEmployees(data || []);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUserDisplayName(session.user.email); // or session.user.user_metadata.full_name if available
      } else {
        setUserDisplayName('Not signed in');
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const newEmployee = {
      name: formData.name,
      email: formData.email,
      position: formData.position,
      location: formData.location,
      equipment: formData.equipment
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const { error } = await supabase.from('employees').insert([newEmployee]);
    if (error) {
      alert('Error registering employee: ' + error.message);
    } else {
      alert('Employee registered!');
      setFormData({ name: '', email: '', position: '', location: '', equipment: '' });
      setIsModalOpen(false);
      await fetchEmployees(); // <-- Always fetch after insert
    }
  };

  const handleDeleteEmployee = async (id) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      alert('Error deleting employee: ' + error.message);
    } else {
      await fetchEmployees(); // Refresh the list after deletion
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-black">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
            <span className="text-sm">{userDisplayName}</span>
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
                  {(Array.isArray(emp.equipment) ? emp.equipment : [emp.equipment]).map((eq, i) =>
                    eq ? <li key={i}>{eq}</li> : null
                  )}
                </ul>
                <button
                  className="bg-red-500 text-white mt-4 px-3 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDeleteEmployee(emp.id)}
                >
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
