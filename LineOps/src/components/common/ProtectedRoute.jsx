import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ token, content }) => {
  // Redirect to login if no token exists
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Render protected content if authenticated
  return content;
};

ProtectedRoute.propTypes = {
  token: PropTypes.string,
  content: PropTypes.node.isRequired,
};

export default ProtectedRoute;