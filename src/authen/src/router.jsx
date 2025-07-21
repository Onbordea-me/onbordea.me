import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Analytics from './components/Analytics';
import Equipment from './components/Equipment';
import Requests from './components/Requests'; // New import
import Settings from './components/Settings'; // New import
import Support from './components/Support';   // New import
import Reports from './components/Reports';   // New import
import AdminSignin from './components/AdminSignin.jsx'; 
import AdminDashboard from './components/AdminDashboard.jsx'; // Assuming you have an AdminDashboard component


export const router = createBrowserRouter([
    { path: "/", element: <Signup /> },
    { path: "/Signup", element: <Signup /> },
    { path: "/Signin", element: <Signin /> },
    { path: "/Dashboard", element: <Dashboard /> },
    { path: "/Employees", element: <Employees /> },
    { path: "/equipment", element: <Equipment /> },
    { path: "/analytics", element: <Analytics /> },
    { path: "/requests", element: <Requests /> }, // New route
    { path: "/settings", element: <Settings /> }, // New route
    { path: "/support", element: <Support /> },   // New route
    { path: "/reports", element: <Reports /> },   // New route
    { path: "/AdminSignin", element: <AdminSignin /> },
    { path: "/AdminDashboard", element: <AdminDashboard /> } // New route for Admin Dashboard
]);