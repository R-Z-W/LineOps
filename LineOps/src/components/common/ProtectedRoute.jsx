import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ token, children }) => {
  // Redirect to login if no token exists
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Render protected content if authenticated
  return children;
};

ProtectedRoute.propTypes = {
  token: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
