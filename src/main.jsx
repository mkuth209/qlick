import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import NewRestaurant from './pages/NewRestaurant.jsx'
import EditRestaurant from './pages/EditRestaurant.jsx'
import CustomerApp from './pages/CustomerApp.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import Login from './pages/Login.jsx'

function ProtectedAdmin({ children }) {
  const auth = sessionStorage.getItem('qlick_admin')
  return auth === 'true' ? children : <Navigate to="/admin/login" replace />
}

function ProtectedDashboard({ children }) {
  const stored = sessionStorage.getItem('qlick_user')
  if (!stored) return <Navigate to="login" replace />
  try {
    JSON.parse(stored)
    return children
  } catch (_) {
    return <Navigate to="login" replace />
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin><AdminPanel /></ProtectedAdmin>} />
        <Route path="/admin/new" element={<ProtectedAdmin><NewRestaurant /></ProtectedAdmin>} />
        <Route path="/admin/:id/edit" element={<ProtectedAdmin><EditRestaurant /></ProtectedAdmin>} />
        <Route path="/:id/login" element={<Login />} />
        <Route path="/:id/dashboard" element={<ProtectedDashboard><OwnerDashboard /></ProtectedDashboard>} />
        <Route path="/:id" element={<CustomerApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
