import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/Login';
import Dashboard from './components/workorder/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import './index.css';

const App = () => {
  // Initialize token state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route 
        path="/login" 
        element={<LoginPage setToken={setToken} />} 
      />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={token}>
            <Dashboard setToken={setToken} />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback Route - Redirect to Login */}
      <Route 
        path="*" 
        element={<Navigate to="/login" />} 
      />
    </Routes>
  );
};

export default App;