import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/Login';
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
    </Routes>
  );
};

export default App;