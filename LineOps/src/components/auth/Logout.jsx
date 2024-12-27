import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/auth.css';

const Logout = ({ setToken }) => {
  // Navigation hook for redirect after logout
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Update token state in parent
    setToken(null);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button 
      className="logout-button"
      onClick={handleLogout}
      aria-label="Logout"
    >
      Logout
    </button>
  );
};

// Prop type validation
Logout.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Logout;
