import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees'; // adjust the path if needed


export const router = createBrowserRouter([
   
    {path: "/", element: <Signup />},
    {path: "/Signup", element: <Signup />},
    {path: "/Signin", element: <Signin />},
    {path: "/Dashboard", element: <Dashboard />},
    {path: "/Employees", element: <Employees />}

]);