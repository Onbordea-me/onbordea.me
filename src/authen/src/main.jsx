import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bg-gray-900 text-teal-400 py-4 text-center shadow-md"> {/* Added styling div */}
      <h1 className="text-3xl font-bold"> {/* Removed pt-4, added font-bold */}
        OnBordea.Me
      </h1>
    </div>
    <AuthContextProvider>
      <RouterProvider router={router} />  
    </AuthContextProvider>
  </StrictMode>,
)