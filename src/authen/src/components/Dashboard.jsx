import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Make sure to install @supabase/supabase-js

// --- Supabase Configuration (from main_app.js) ---
const SUPABASE_URL = 'https://plztqnszikysepsoawhy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlenRxbnN6aWt5c2Vwc29hd2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODAxNTUsImV4cCI6MjA2NTc1NjE1NX0.Sjqk7ulL4wW8dg1hyyEP2NVCsMd0RcNbUUN8X1WQEog';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Mock Data for Employee Detail Modal (from index.html inline script) ---
const mockTicketData = {
  123: [
    { ticket: 'Onboarding', status: 'Completado', date: '1 ene. 2024' },
    { ticket: 'Onboarding', status: 'Pendiente', date: '14 dic. 2023' }
  ],
  // You would expand this with more data as needed for other employees
  // For 'Laura Sanchez' and 'Juan Gonzalez' using data-id="123", they will also show Anna's tickets.
  // In a real app, each would have unique IDs and corresponding ticket data.
};

const App = () => {
  // --- State for Sidebar (from sidebar.js) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- State for Modals (from index.html inline script) ---
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);

  // --- State for Employee Data ---
  const [userDisplayName, setUserDisplayName] = useState('Loading...'); // From main_app.js
  const [employees, setEmployees] = useState([]); // For the employee dropdown and detail
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For employee detail modal

  // --- Supabase Auth and User Info (from main_app.js) ---
  useEffect(() => {
    async function checkAuthAndLoadUserInfo() {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      }

      if (!session) {
        console.log('No session found. Redirecting to login page.');
        window.location.href = 'login.html';
        return;
      }

      setUserDisplayName(session.user.email);

      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading user profile name:', profileError);
        } else if (profile && profile.name) {
          setUserDisplayName(profile.name);
        } else {
          console.warn('User profile name not found. Displaying email.');
        }
      } catch (profileFetchError) {
        console.error('Network or unexpected error fetching profile:', profileFetchError);
      }
    }

    checkAuthAndLoadUserInfo();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        console.log('Auth state changed to SIGNED_OUT. Redirecting to login.');
        window.location.href = 'login.html';
      }
    });

    return () => {
      authListener.subscription.unsubscribe(); // Cleanup subscription
    };
  }, []);

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out: ' + error.message);
    } else {
      console.log('User signed out from main app.');
      window.location.href = 'login.html';
    }
  };

  // --- Load Employees for Dropdown (from index.html inline script) ---
  const loadEmployees = async () => {
    try {
      // In a real React app, you'd likely fetch from your Supabase table directly
      // For this conversion, mimicking the original JS's fetch to a JSON file
      const response = await fetch('./backend/routes/employees.json');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
      setEmployees([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (showNewRequestModal) {
      loadEmployees();
    }
  }, [showNewRequestModal]);

  // --- New Request Form Submission (from index.html inline script) ---
  const handleNewRequestSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      tipo: formData.get('tipo'),
      pais: formData.get('pais'),
      nombre: formData.get('nombre'),
      telefono: formData.get('telefono'),
      email: formData.get('email'),
      equipo: formData.get('equipo'),
      software: formData.get('software')
    };

    try {
      // This fetch simulates the original JS. In a React app with Supabase,
      // you'd typically use `supabase.from('pedidos').insert([data])`.
      const res = await fetch('/api/pedidos', { // Adjust this URL to your actual API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Pedido creado exitosamente');
        setShowNewRequestModal(false);
        e.target.reset(); // Reset form
      } else {
        const err = await res.json();
        alert('Error: ' + (err.error || 'No se pudo crear el pedido'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // --- Handle "Register New Employee" Option ---
  const handleEmployeeSelectChange = (e) => {
    if (e.target.value === 'new') {
      setShowAddEmployeeModal(true);
    }
  };

  // --- Add Employee Form Submission (from index.html inline script) ---
  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmployee = {
      name: formData.get('name'),
      email: formData.get('email'),
      position: formData.get('position'),
      location: formData.get('location'),
      equipment: formData.get('equipment')?.split(',').map(item => item.trim()) // Handle optional splitting
    };

    try {
      // This fetch simulates the original JS. In a React app with Supabase,
      // you'd typically use `supabase.from('employees').insert([newEmployee])`.
      await fetch('./backend/employees.json', { // Adjust this URL to your actual API endpoint
        method: 'POST',
        body: JSON.stringify(newEmployee),
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Empleado registrado exitosamente');
      setShowAddEmployeeModal(false);
      e.target.reset();
      loadEmployees(); // Reload employees to update the dropdown
    } catch (err) {
      alert('Error registering employee: ' + err.message);
    }
  };

  // --- Employee Detail Modal Logic (from index.html inline script) ---
  const openEmployeeDetail = (id, name, country) => {
    setSelectedEmployee({ id, name, country });
    setShowEmployeeDetailModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans']">
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`w-${isSidebarOpen ? '48' : '20'} bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 transition-all duration-300`}
      >
        {/* Logo */}
        <a href="index.html">
          <img src="../../assets/logo.png" alt="Logo" className="w-12 h-12" /> {/* Adjust size as needed */}
        </a>
        {/* Navigation */}
        <nav id="sidebar-nav" className="flex flex-col items-center space-y-6 mt-4 w-full">
          <a href="employees.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>👥</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Employees</span>
          </a>
          <a href="equipment.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>📦</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Equipment</span>
          </a>
          <a href="requests.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>📬</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Requests</span>
          </a>
          <a href="analytics.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>📊</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Analytics</span>
          </a>
          <a href="reports.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>🗂️</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Reports</span>
          </a>
          <a href="settings.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>🛰️</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Settings</span>
          </a>
          <a href="support.html" className="flex items-center space-x-2 py-1 rounded hover:bg-gray-800 transition px-4 w-full justify-start">
            <span>🌐</span>
            <span className={`sidebar-label ${isSidebarOpen ? '' : 'hidden'} text-sm`}>Support</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            <button id="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 text-xl">
              ☰
            </button>
            <input type="text" placeholder="Search..." className="px-3 py-1 border rounded-md text-sm focus:outline-none" />
            <button className="bg-indigo-500 text-white px-4 py-1 rounded text-sm">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="flex items-center space-x-2">
              <span id="user-display-name" className="text-sm">{userDisplayName}</span>
              <button id="signout-btn-navbar" onClick={signOutUser} className="text-gray-500 hover:text-gray-700 text-xs">
                (Sign Out)
              </button>
            </span>
          </div>
        </header>

        {/* Dashboard + Map */}
        <main className="bg-white p-6 rounded shadow flex flex-col gap-6 overflow-auto m-6">
          {/* Dashboard Overview */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="bg-blue-100 text-blue-900 p-4 rounded shadow w-40">
                <p className="text-sm font-semibold">Empleados Activos</p>
                <p className="text-2xl font-bold">25</p>
              </div>
              <div className="bg-white p-4 rounded shadow w-40">
                <p className="text-sm font-semibold">Tickets Abiertos</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-white p-4 rounded shadow w-40">
                <p className="text-sm font-semibold">Tickets en Proceso</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="bg-white p-4 rounded shadow w-56">
                <p className="text-sm font-semibold">Últimos Movimientos</p>
                <p className="text-sm mt-1 text-gray-700">Offboarding solicitado<br />2 empleados</p>
              </div>
            </div>
            <button onClick={() => setShowNewRequestModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              + Nuevo Pedido
            </button>
          </div>

          {/* Alert Message */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow text-sm">
            ⚠️ Entrega demorada para Juan Pérez
          </div>

          {/* Tickets Table */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tickets Recientes</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm bg-white border border-gray-200 rounded shadow">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Empleado</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Fecha de Creación</th>
                    <th className="px-4 py-2 text-left">Fecha de Actualiz.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">Onboarding</td>
                    <td>
                      <button
                        onClick={() => openEmployeeDetail('123', 'Anna Martinez', 'USA')}
                        className="text-blue-600 hover:underline"
                      >
                        Anna Martinez
                      </button>
                    </td>
                    <td className="px-4 py-2"><span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">En preparación</span></td>
                    <td className="px-4 py-2">24 abr 2024</td>
                    <td className="px-4 py-2">25 abr 2024</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Offboarding</td>
                    <td>
                      <button
                        onClick={() => openEmployeeDetail('123', 'Laura Sanchez', 'Mexico')} 
                        className="text-blue-600 hover:underline"
                      >
                        Laura Sanchez
                      </button>
                    </td>
                    <td className="px-4 py-2"><span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Solicitado</span></td>
                    <td className="px-4 py-2">23 abr 2024</td>
                    <td className="px-4 py-2">23 abr 2024</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Mantenimiento</td>
                    <td>
                      <button
                        onClick={() => openEmployeeDetail('123', 'Juan Gonzalez', 'Spain')} 
                        className="text-blue-600 hover:underline"
                      >
                        Juan Gonzalez
                      </button>
                    </td>
                    <td className="px-4 py-2"><span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">En proceso</span></td>
                    <td className="px-4 py-2">22 abr 2024</td>
                    <td className="px-4 py-2">24 abr 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-4 flex-1 relative min-h-[400px]">
            <h2 className="font-semibold mb-2">Employee Map (Map component excluded)</h2>
            <div className="map-wrapper bg-gray-200 flex items-center justify-center text-gray-600">
              <p>Map component would go here</p>
            </div>
          </div>
        </main>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div id="newRequestModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Nuevo Pedido</h2>
              <button onClick={() => setShowNewRequestModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleNewRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Tipo de Pedido</label>
                  <select name="tipo" className="w-full border rounded px-3 py-2" required>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Offboarding">Offboarding</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">País</label>
                  <input type="text" name="pais" className="w-full border rounded px-3 py-2" placeholder="Ej: USA" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Empleado</label>
                  <select
                    id="employeeSelect"
                    name="nombre"
                    required
                    className="w-full border rounded px-3 py-2"
                    onChange={handleEmployeeSelectChange}
                    value={selectedEmployee?.name || ""} // If you want to control this input
                  >
                    <option value="">Seleccione Empleado</option>
                    {employees.map(emp => (
                      <option key={emp.id || emp.name} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                    <option value="new">Register New Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Teléfono</label>
                  <input type="text" name="telefono" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Dirección Email</label>
                <input type="email" name="email" className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Tipo de Equipo</label>
                  <input type="text" name="equipo" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Software Requerido</label>
                  <select name="software" className="w-full border rounded px-3 py-2">
                    <option value="">Seleccione</option>
                    <option value="Office Suite">Office Suite</option>
                    <option value="Design Tools">Design Tools</option>
                    <option value="Antivirus">Antivirus</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowNewRequestModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crear Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {showEmployeeDetailModal && selectedEmployee && (
        <div id="employeeDetailModal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Detalle de Empleado</h2>
              <button onClick={() => setShowEmployeeDetailModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div id="employeeDetailContent">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-700">
                  <span id="employeeInitials">{selectedEmployee.name.split(' ').map(w => w[0]).join('').toUpperCase()}</span>
                </div>
                <div>
                  <h3 id="employeeName" className="font-medium text-lg">{selectedEmployee.name}</h3>
                  <p id="employeeCountry" className="text-sm text-gray-500">{selectedEmployee.country}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Equipos Asignados</h4>
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Ticket</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody id="employeeTickets">
                    {(mockTicketData[selectedEmployee.id] || []).map((ticket, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{ticket.ticket}</td>
                        <td className="p-2">{ticket.status}</td>
                        <td className="p-2">{ticket.date}</td>
                      </tr>
                    ))}
                    {/* Fallback if no tickets found */}
                    {!(mockTicketData[selectedEmployee.id] && mockTicketData[selectedEmployee.id].length > 0) && (
                      <tr>
                        <td colSpan="3" className="p-2 text-center text-gray-500">No tickets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div id="addEmployeeModal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Registrar Nuevo Empleado</h2>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input type="text" name="name" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Puesto</label>
                <input type="text" name="position" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Ubicación</label>
                <input type="text" name="location" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Equipo (opcional, separado por comas)</label>
                <input type="text" name="equipment" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;