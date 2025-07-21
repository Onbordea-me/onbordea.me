import React, { useState, useEffect } from 'react';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminDashboard = () => {
  // --- Auth/User State ---
  const { session, signOutUser } = UserAuth();
  const navigate = useNavigate();
  const [userDisplayName, setUserDisplayName] = useState('Loading...');

  // --- UI State ---
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // --- Data State ---
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);

  // --- Auth & Profile Loading ---
  useEffect(() => {
    async function checkAuthAndLoadUserInfo() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error('Error getting session:', error);
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
        navigate('/Signin');
        return;
      }

      setUserDisplayName(session.user.email);

      // Optionally fetch additional user data if needed
      // Since you're not using user_profiles, you can skip profile fetching
    }
    checkAuthAndLoadUserInfo();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        navigate('/AdminSignin');
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
      const { data, error } = await supabase.from('employees').select('id, name, email, position, location, equipment');
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
      const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
      console.log("Loaded all requests:", data);
    } catch (err) {
      setRequests([]);
      console.error("Error loading requests:", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadRequests();
  }, []);

  // --- New Request Form Submission ---
  const handleNewRequestSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedEmployeeId = formData.get('employee_id');
    const employeeName = employees.find(emp => emp.id === selectedEmployeeId)?.name || 'N/A';

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Error: No authenticated user found. Please log in.');
      return;
    }

    const dataToInsert = {
      type: formData.get('tipo'),
      employee: employeeName,
      equipment: formData.get('equipo'),
      software: formData.get('software'),
      message: formData.get('message'),
      status: 'Pendiente',
      user_id: user.id
    };

    try {
      const { error } = await supabase.from('pedidos').insert([dataToInsert]);
      if (!error) {
        alert('Pedido creado exitosamente');
        setShowNewRequestModal(false);
        e.target.reset();
        loadRequests();
      } else {
        console.error('Supabase error during insert:', error);
        alert('Error: ' + (error.message || 'Ha ocurrido un error desconocido al crear el pedido.'));
      }
    } catch (err) {
      console.error('Unexpected error creating request:', err);
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
      const { data, error } = await supabase.from('employees').insert([newEmployee]);
      if (error) throw error;
      alert('Empleado registrado exitosamente');
      setShowAddEmployeeModal(false);
      e.target.reset();
      loadEmployees();
    } catch (err) {
      alert('Error registering employee: ' + err.message);
    }
  };

  // --- Employee Detail Modal Logic ---
  const openEmployeeDetail = (employee) => {
    setSelectedEmployee({ ...employee, tickets: requests.filter(req => req.employee === employee.name) });
    setShowEmployeeDetailModal(true);
  };

  // --- Edit Ticket Form Submission ---
  const handleEditTicketSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTicket = {
      id: selectedTicket.id,
      type: formData.get('tipo'),
      status: formData.get('estado'),
      message: formData.get('mensaje'),
      completed_at: formData.get('estado') === 'Completado' ? new Date().toISOString() : null,
    };

    try {
      const { error } = await supabase
        .from('pedidos')
        .update(updatedTicket)
        .eq('id', selectedTicket.id);

      if (error) {
        console.error('Supabase error during update:', error);
        alert('Error al actualizar el ticket: ' + (error.message || 'Ha ocurrido un error desconocido.'));
      } else {
        alert('Ticket actualizado exitosamente');
        setShowEditTicketModal(false);
        setSelectedTicket(null);
        loadRequests(); // Refresh the requests list to reflect changes
      }
    } catch (err) {
      console.error('Unexpected error updating ticket:', err);
      alert('Error inesperado al actualizar el ticket: ' + (err.message || 'Por favor, intenta de nuevo.'));
    }
  };

  // --- Loading or Not Authenticated ---
  if (session === undefined) return <div className="bg-black text-green-400 h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!session) {
    navigate("/AdminSignin");
    return null;
  }

  // --- Render ---
  return (
    <div className="flex h-screen overflow-hidden font-['IBM Plex Sans'] bg-gray-900 text-gray-100">
      <div className="flex-1 flex flex-col bg-gray-800">
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-md">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="flex items-center space-x-2">
              <span id="user-display-name" className="text-gray-200">{userDisplayName}</span>
              <button id="signout-btn-navbar" onClick={handleSignOut} className="text-purple-400 hover:text-purple-500 text-xs">
                (Sign Out)
              </button>
            </span>
          </div>
        </header>

        <main className="bg-gray-800 p-6 rounded-lg shadow-inner flex flex-col gap-6 overflow-auto m-6">
          {/* Dashboard Overview */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow w-40 text-blue-400">
                <p className="text-sm font-semibold">Tickets Abiertos</p>
                <p className="text-2xl font-bold">{requests.filter(req => req.status === 'Pendiente' || req.status === 'En preparación').length}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow w-40 text-orange-400">
                <p className="text-sm font-semibold">Tickets en Proceso</p>
                <p className="text-2xl font-bold">{requests.filter(req => req.status === 'En proceso').length}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow w-56 text-gray-300">
                <p className="text-sm font-semibold">Últimos Movimientos</p>
                <p className="text-sm mt-1 text-gray-400">Offboarding solicitado<br />2 empleados</p>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-400">Todos los Tickets</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm bg-gray-900 border border-gray-700 rounded-lg shadow text-gray-200">
                <thead className="bg-gray-700 text-gray-100 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Empleado</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Fecha de Creación</th>
                    <th className="px-4 py-2 text-left">Mensaje</th>
                    <th className="px-4 py-2 text-left">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <tr key={request.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-2">{request.type}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openEmployeeDetail({ name: request.employee })}
                            className="text-purple-400 hover:underline"
                          >
                            {request.employee}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === 'Pendiente' ? 'bg-yellow-800 text-yellow-200' :
                            request.status === 'En proceso' ? 'bg-blue-800 text-blue-200' :
                            request.status === 'Completado' ? 'bg-green-800 text-green-200' :
                            'bg-gray-600 text-gray-200'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(request.created_at).toLocaleDateString('es-AR')}</td>
                        <td className="px-4 py-2">{request.message}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => { setSelectedTicket(request); setShowEditTicketModal(true); }}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No hay tickets registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resolved Tickets Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-400">Tickets Resueltos</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm bg-gray-900 border border-gray-700 rounded-lg shadow text-gray-200">
                <thead className="bg-gray-700 text-gray-100 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Empleado</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Fecha de Creación</th>
                    <th className="px-4 py-2 text-left">Fecha de Completado</th>
                    <th className="px-4 py-2 text-left">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter(req => req.status === 'Completado').length > 0 ? (
                    requests.filter(req => req.status === 'Completado').map((request) => (
                      <tr key={request.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-2">{request.type}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openEmployeeDetail({ name: request.employee })}
                            className="text-purple-400 hover:underline"
                          >
                            {request.employee}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-800 text-green-200">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(request.created_at).toLocaleDateString('es-AR')}</td>
                        <td className="px-4 py-2">{request.completed_at ? new Date(request.completed_at).toLocaleDateString('es-AR') : 'N/A'}</td>
                        <td className="px-4 py-2">{request.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No hay tickets resueltos.</td>
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
        <div id="newRequestModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-400">Nuevo Pedido</h2>
              <button onClick={() => setShowNewRequestModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">×</button>
            </div>
            <form onSubmit={handleNewRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-300">Tipo de Pedido</label>
                  <select id="requestType" name="tipo" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" required>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Offboarding">Offboarding</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Equipment Change">Equipment Change</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-300">Nombre del Empleado</label>
                  <select
                    id="employeeSelect"
                    name="employee_id"
                    required
                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
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
                  <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-300">Tipo de Equipo</label>
                  <input type="text" id="equipmentType" name="equipo" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label htmlFor="softwareRequired" className="block text-sm font-medium text-gray-300">Software Requerido</label>
                  <select id="softwareRequired" name="software" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500">
                    <option value="">Seleccione</option>
                    <option value="Office Suite">Office Suite</option>
                    <option value="Design Tools">Design Tools</option>
                    <option value="Antivirus">Antivirus</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="messageDescription" className="block text-sm font-medium text-gray-300">Mensaje/Descripción</label>
                <textarea id="messageDescription" name="message" rows="3" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" placeholder="Detalles adicionales del pedido..."></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowNewRequestModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Crear Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {showEmployeeDetailModal && selectedEmployee && (
        <div id="employeeDetailModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-400">Detalle de Empleado</h2>
              <button onClick={() => setShowEmployeeDetailModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">×</button>
            </div>
            <div id="employeeDetailContent">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center font-semibold text-gray-300">
                  <span id="employeeInitials">{selectedEmployee.name.split(' ').map(w => w[0]).join('').toUpperCase()}</span>
                </div>
                <div>
                  <h3 id="employeeName" className="font-medium text-lg text-gray-200">{selectedEmployee.name}</h3>
                  <p id="employeeEmail" className="text-sm text-gray-400">{selectedEmployee.email || 'N/A'}</p>
                  <p id="employeePosition" className="text-sm text-gray-400">{selectedEmployee.position || 'N/A'}</p>
                  <p id="employeeLocation" className="text-sm text-gray-400">{selectedEmployee.location || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Tickets Asociados</h4>
                <table className="w-full text-sm border border-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gray-700 text-gray-100">
                      <th className="p-2 text-left">Tipo</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Fecha de Creación</th>
                      <th className="p-2 text-left">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter(req => req.employee === selectedEmployee.name).length > 0 ? (
                      requests.filter(req => req.employee === selectedEmployee.name).map((ticket, index) => (
                        <tr key={index} className="border-t border-gray-700 hover:bg-gray-700">
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
        <div id="addEmployeeModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-400">Registrar Nuevo Empleado</h2>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">×</button>
            </div>
            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-300">Nombre</label>
                <input type="text" id="employeeName" name="name" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" id="employeeEmail" name="email" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label htmlFor="employeePosition" className="block text-sm font-medium text-gray-300">Puesto</label>
                <input type="text" id="employeePosition" name="position" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label htmlFor="employeeLocation" className="block text-sm font-medium text-gray-300">Ubicación</label>
                <input type="text" id="employeeLocation" name="location" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label htmlFor="employeeEquipment" className="block text-sm font-medium text-gray-300">Equipo (opcional, separado por comas)</label>
                <input type="text" id="employeeEquipment" name="equipment" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditTicketModal && selectedTicket && (
        <div id="editTicketModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-400">Editar Ticket</h2>
              <button onClick={() => { setShowEditTicketModal(false); setSelectedTicket(null); }} className="text-gray-400 hover:text-gray-200 text-2xl">×</button>
            </div>
            <form onSubmit={handleEditTicketSubmit} className="space-y-4">
              <div>
                <label htmlFor="editType" className="block text-sm font-medium text-gray-300">Tipo de Pedido</label>
                <select id="editType" name="tipo" defaultValue={selectedTicket.type} className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" required>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Offboarding">Offboarding</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Equipment Change">Equipment Change</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium text-gray-300">Estado</label>
                <select id="editStatus" name="estado" defaultValue={selectedTicket.status} className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" required>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
              <div>
                <label htmlFor="editMessage" className="block text-sm font-medium text-gray-300">Mensaje/Descripción</label>
                <textarea id="editMessage" name="mensaje" defaultValue={selectedTicket.message} rows="3" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500" placeholder="Detalles adicionales del pedido..."></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => { setShowEditTicketModal(false); setSelectedTicket(null); }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;