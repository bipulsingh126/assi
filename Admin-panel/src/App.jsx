import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import { authAPI } from './services/api'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is authenticated
    const validateAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          // Verify token is valid by making a request to get user data
          await authAPI.getMe()
          setIsAuthenticated(true)
        } catch (error) {
          // If token is invalid, clear localStorage
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    
    validateAuth()
  }, [])

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      // Show loading state while checking authentication
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    
    return children
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register setIsAuthenticated={setIsAuthenticated} />
        } />
      </Route>
      
      {/* Dashboard Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
      </Route>
      
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
