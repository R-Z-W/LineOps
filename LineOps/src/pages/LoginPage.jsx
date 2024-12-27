import PropTypes from 'prop-types';
import Login from '../components/auth/Login';
import '../styles/LoginPage.css';

const LoginPage = ({ setToken }) => {
  return (
    <div className="login-page" role="main" aria-label="Login Page">
      {/* Login form component */}
      <Login setToken={setToken} />
    </div>
  );
};

// Props validation
LoginPage.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default LoginPage;
