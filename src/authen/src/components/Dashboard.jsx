import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './NavBar';
import { supabase } from '../supabaseClient';

// --- Mock Data for Employee Detail Modal (Consider fetching this from Supabase as well) ---
const mockTicketData = {
  123: [
    { ticket: 'Onboarding', status: 'Completado', date: '1 ene. 2024' },
    { ticket: 'Onboarding', status: 'Pendiente', date: '14 dic. 2023' }
  ],
};

const Dashboard = () => {
  // --- Auth/User State ---
  const { session, signOutUser } = UserAuth();
  const navigate = useNavigate();
  const [userDisplayName, setUserDisplayName] = useState('Loading...');

  // --- UI State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);

  // --- Data State ---
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]); // New state for requests
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // --- Auth & Profile Loading ---
  useEffect(() => {
    async function checkAuthAndLoadUserInfo() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error('Error getting session:', error);
      if (!session) {
        navigate('/Signin');
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
        }
      } catch (profileFetchError) {
            console.error('Network or unexpected error fetching profile:', profileFetchError);
        }
    }
    checkAuthAndLoadUserInfo();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        navigate('/Signin');
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // --- Sign Out Handler ---
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- Employees Loading ---
  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase.from('employees').select('id, name');
      if (error) throw error;
      setEmployees(data || []);
      console.log("Loaded employees:", data);
    } catch (err) {
      setEmployees([]);
      console.log("Error loading employees:", err);
    }
  };

  // --- Requests Loading ---
  const loadRequests = async () => {
    try {
      // Fetch requests from the 'pedidos' table
      const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
      console.log("Loaded requests:", data);
    } catch (err) {
      setRequests([]);
      console.error("Error loading requests:", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadRequests(); // Load requests on component mount
  }, []);

  // --- New Request Form Submission ---
  const handleNewRequestSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Find the employee name based on the selected employee ID
    const selectedEmployeeId = formData.get('employee_id');
    const employeeName = employees.find(emp => emp.id === selectedEmployeeId)?.name || 'N/A';

    const dataToInsert = {
      type: formData.get('tipo'),
      country: formData.get('pais'),
      employee: employeeName, // Storing employee name
      phone: formData.get('telefono'),
      email: formData.get('email'),
      equipment: formData.get('equipo'),
      software: formData.get('software'),
      message: formData.get('message'), // New field for message/description
      status: 'Pendiente', // Default status for new requests
    };

    try {
      const { error } = await supabase.from('pedidos').insert([dataToInsert]);
      if (!error) {
        alert('Pedido creado exitosamente');
        setShowNewRequestModal(false);
        e.target.reset();
        loadRequests(); // Refresh the requests table after successful insertion
      } else {
        console.error('Supabase error during insert:', error); // Log the full error object
        alert('Error: ' + (error.message || 'Ha ocurrido un error desconocido al crear el pedido.'));
      }
    } catch (err) {
      console.error('Unexpected error creating request:', err); // Log unexpected errors
      alert('Error creating request: ' + (err.message || 'Ha ocurrido un error inesperado.'));
    }
  };

  // --- Add Employee Form Submission ---
  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmployee = {
      name: formData.get('name'),
      email: formData.get('email'),
      position: formData.get('position'),
      location: formData.get('location'),
      equipment: formData.get('equipment')?.split(',').map(item => item.trim())
    };
    try {
      // Assuming 'employees' is a Supabase table, not a local JSON file
      const { data, error } = await supabase.from('employees').insert([newEmployee]);
      if (error) throw error;
      alert('Empleado registrado exitosamente');
      setShowAddEmployeeModal(false);
      e.target.reset();
      loadEmployees(); // Refresh the employees list
    } catch (err) {
      alert('Error registering employee: ' + err.message);
    }
  };

  // --- Employee Detail Modal Logic ---
  const openEmployeeDetail = (employee) => {
    // For now, using mockTicketData. In a real app, you'd fetch tickets related to this employee.
    setSelectedEmployee({ ...employee, tickets: mockTicketData[employee.id] || [] });
    setShowEmployeeDetailModal(true);
  };

  // --- Loading or Not Authenticated ---
  if (session === undefined) return <div className="bg-black text-green-400 h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!session) {
    navigate("/Signin");
    return null;
  }

  // --- Render ---
  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-black">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col bg-black ${isSidebarOpen ? 'ml-48' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow">
          <div className="flex items-center space-x-4">
            {/* The toggle button is now handled by the Navbar component */}
            <h1 className="text-lg font-semibold text-green-300">Dashboard</h1>
            <input type="text" placeholder="Search..." className="px-3 py-1 border rounded-md text-sm focus:outline-none bg-gray-800 text-green-200 border-green-700" />
            <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-green-600">Search</button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-400">🔔</span>
            <span className="flex items-center space-x-2">
              <span id="user-display-name" className="text-green-300">{userDisplayName}</span>
              <button id="signout-btn-navbar" onClick={handleSignOut} className="text-green-400 hover:text-blue-400 text-xs">
                (Sign Out)
              </button>
            </span>
          </div>
        </header>

        {/* Dashboard + Map */}
        <main className="bg-black p-6 rounded shadow flex flex-col gap-6 overflow-auto m-6">
          {/* Dashboard Overview */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="bg-blue-900 text-green-300 p-4 rounded shadow w-40">
                <p className="text-sm font-semibold">Empleados Activos</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <div className="bg-black border border-blue-900 p-4 rounded shadow w-40 text-blue-400">
                <p className="text-sm font-semibold">Tickets Abiertos</p>
                <p className="text-2xl font-bold">{requests.filter(req => req.status === 'Pendiente' || req.status === 'En preparación').length}</p>
              </div>
              <div className="bg-black border border-green-900 p-4 rounded shadow w-40 text-green-400">
                <p className="text-sm font-semibold">Tickets en Proceso</p>
                <p className="text-2xl font-bold">{requests.filter(req => req.status === 'En proceso').length}</p>
              </div>
              <div className="bg-black border border-green-900 p-4 rounded shadow w-56 text-green-300">
                <p className="text-sm font-semibold">Últimos Movimientos</p>
                <p className="text-sm mt-1 text-green-400">Offboarding solicitado<br />2 empleados</p>
              </div>
            </div>
            <button onClick={() => setShowNewRequestModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              + Nuevo Pedido
            </button>
          </div>

          {/* Alert Message */}
          <div className="bg-blue-900 border-l-4 border-green-500 text-green-200 p-4 rounded shadow text-sm">
            ⚠️ Entrega demorada para Juan Pérez
          </div>

          {/* Tickets Table */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Tickets Recientes</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm bg-black border border-green-900 rounded shadow text-green-200">
                <thead className="bg-blue-900 text-green-300 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Empleado</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Fecha de Creación</th>
                    {/* <th className="px-4 py-2 text-left">Fecha de Actualiz.</th> */}
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="px-4 py-2">{request.type}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openEmployeeDetail(request)} // Pass the whole request object
                            className="text-blue-600 hover:underline"
                          >
                            {request.employee}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            request.status === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' :
                            request.status === 'En proceso' ? 'bg-blue-200 text-blue-800' :
                            request.status === 'Completado' ? 'bg-green-200 text-green-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(request.created_at).toLocaleDateString('es-AR')}</td>
                        {/* <td className="px-4 py-2"></td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No hay pedidos recientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  <label htmlFor="requestType" className="block text-sm font-medium">Tipo de Pedido</label>
                  <select id="requestType" name="tipo" className="w-full border rounded px-3 py-2" required>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Offboarding">Offboarding</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Equipment Change">Equipment Change</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option> {/* Corrected: Added value="Other" */}
                  </select>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium">País</label>
                  <input type="text" id="country" name="pais" className="w-full border rounded px-3 py-2" placeholder="Ej: USA" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Empleado</label>
                  <select
                    id="employeeSelect"
                    name="employee_id"
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Seleccione Empleado</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium">Teléfono</label>
                  <input type="text" id="phoneNumber" name="telefono" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium">Dirección Email</label>
                <input type="email" id="emailAddress" name="email" className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="equipmentType" className="block text-sm font-medium">Tipo de Equipo</label>
                  <input type="text" id="equipmentType" name="equipo" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label htmlFor="softwareRequired" className="block text-sm font-medium">Software Requerido</label>
                  <select id="softwareRequired" name="software" className="w-full border rounded px-3 py-2">
                    <option value="">Seleccione</option>
                    <option value="Office Suite">Office Suite</option>
                    <option value="Design Tools">Design Tools</option>
                    <option value="Antivirus">Antivirus</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="messageDescription" className="block text-sm font-medium">Mensaje/Descripción</label>
                <textarea id="messageDescription" name="message" rows="3" className="w-full border rounded px-3 py-2" placeholder="Detalles adicionales del pedido..."></textarea>
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
                  <span id="employeeInitials">{selectedEmployee.employee.split(' ').map(w => w[0]).join('').toUpperCase()}</span>
                </div>
                <div>
                  <h3 id="employeeName" className="font-medium text-lg">{selectedEmployee.employee}</h3>
                  <p id="employeeCountry" className="text-sm text-gray-500">{selectedEmployee.country}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tickets Asociados</h4>
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Tipo</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Fecha de Creación</th>
                      <th className="p-2 text-left">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter(req => req.employee === selectedEmployee.employee).length > 0 ? (
                      requests.filter(req => req.employee === selectedEmployee.employee).map((ticket, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{ticket.type}</td>
                          <td className="p-2">{ticket.status}</td>
                          <td className="p-2">{new Date(ticket.created_at).toLocaleDateString('es-AR')}</td>
                          <td className="p-2">{ticket.message}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-2 text-center text-gray-500">No tickets found for this employee.</td>
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
                <label htmlFor="employeeName" className="block text-sm font-medium">Nombre</label>
                <input type="text" id="employeeName" name="name" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium">Email</label>
                <input type="email" id="employeeEmail" name="email" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label htmlFor="employeePosition" className="block text-sm font-medium">Puesto</label>
                <input type="text" id="employeePosition" name="position" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label htmlFor="employeeLocation" className="block text-sm font-medium">Ubicación</label>
                <input type="text" id="employeeLocation" name="location" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label htmlFor="employeeEquipment" className="block text-sm font-medium">Equipo (opcional, separado por comas)</label>
                <input type="text" id="employeeEquipment" name="equipment" className="w-full border rounded px-3 py-2" />
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

export default Dashboard;