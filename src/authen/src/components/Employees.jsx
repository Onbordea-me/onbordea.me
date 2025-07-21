import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    position: '',
    location: '',
    equipment: '',
    status: 'active',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState('Loading...');
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } else {
      setEmployees(data || []);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUserDisplayName(session.user.email);
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
      status: formData.status,
    };

    const { error } = await supabase.from('employees').insert([newEmployee]);
    if (error) {
      alert('Error registering employee: ' + error.message);
    } else {
      alert('Employee registered!');
      setFormData({ id: null, name: '', email: '', position: '', location: '', equipment: '', status: 'active' });
      setIsModalOpen(false);
      await fetchEmployees();
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      position: formData.position,
      location: formData.location,
      equipment: formData.equipment
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      status: formData.status,
    };
    console.log('Form data before update:', formData);
    console.log('Update payload:', updatedEmployee);
    const { error, data } = await supabase.from('employees').update(updatedEmployee).eq('id', formData.id);
    console.log('Update response:', { error, data });
    if (error) {
      alert('Error updating employee: ' + error.message);
    } else {
      alert('Employee updated!');
      setFormData({ id: null, name: '', email: '', position: '', location: '', equipment: '', status: 'active' });
      setIsEditing(false);
      setIsModalOpen(false);
      await fetchEmployees();
    }
  };

  const handleEditClick = (employee) => {
    setFormData({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      position: employee.position,
      location: employee.location,
      equipment: Array.isArray(employee.equipment) ? employee.equipment.join(', ') : employee.equipment || '',
      status: employee.status,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      alert('Error deleting employee: ' + error.message);
    } else {
      await fetchEmployees();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-gray-900 text-gray-100">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main */}
      <div className={`flex-1 flex flex-col bg-gray-800 ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-md">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search employees..."
              className="px-3 py-1 border border-gray-700 rounded-md text-sm focus:outline-none bg-gray-700 text-gray-100 placeholder-gray-400"
            />
            <button className="bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="text-gray-200 text-sm">{userDisplayName}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800 m-6 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-teal-400">Employees Management</h2>
            <button
              onClick={() => { setIsEditing(false); setFormData({ id: null, name: '', email: '', position: '', location: '', equipment: '', status: 'active' }); setIsModalOpen(true); }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
            >
              Register New Employee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-lg shadow p-4 border border-gray-700"
              >
                <div className="flex items-center space-x-4 mb-2">
                  <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center text-gray-300 font-semibold">
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200">{emp.name}</h3>
                    <p className="text-sm text-gray-400">
                      <a href={`mailto:${emp.email}`}>{emp.email}</a>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  <strong>Position:</strong> {emp.position}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Location:</strong> {emp.location}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <strong>Assigned Equipment:</strong>
                </p>
                <ul className="text-sm text-gray-400 list-disc list-inside">
                  {(Array.isArray(emp.equipment) ? emp.equipment : [emp.equipment]).map((eq, i) =>
                    eq ? <li key={i}>{eq}</li> : null
                  )}
                </ul>
                <p className="text-sm text-gray-300">
                  <strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs font-medium ${
                    emp.status === 'onboarding' ? 'bg-yellow-800 text-yellow-200' :
                    emp.status === 'active' ? 'bg-green-800 text-green-200' :
                    emp.status === 'offboarding' ? 'bg-red-800 text-red-200' :
                    'bg-gray-600 text-gray-200'
                  }`}>{emp.status}</span>
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() => handleEditClick(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    Offboard Employee
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl text-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-teal-400">
              {isEditing ? 'Edit Employee' : 'Register New Employee'}
            </h2>
            <form onSubmit={isEditing ? handleEditEmployee : handleAddEmployee} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Full Name"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              />
              <input
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                type="text"
                placeholder="Position"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
                placeholder="Location"
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              />
              <input
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                type="text"
                placeholder="Assigned Equipment (comma separated)"
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-teal-500"
              >
                <option value="onboarding">Onboarding</option>
                <option value="active">Active</option>
                <option value="offboarding">Offboarding</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditing(false); setFormData({ id: null, name: '', email: '', position: '', location: '', equipment: '', status: 'active' }); }}
                  className="px-4 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-teal-600 text-white hover:bg-teal-700"
                >
                  {isEditing ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}