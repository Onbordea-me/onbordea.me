import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';

export const router = createBrowserRouter([
   
    {path: "/", element: <Signup />},
    {path: "/Signup", element: <Signup />},
    {path: "/Signin", element: <Signin />},
    {path: "/Dashboard", element: <Dashboard />}

]);