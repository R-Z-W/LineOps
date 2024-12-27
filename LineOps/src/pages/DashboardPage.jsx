import PropTypes from 'prop-types';
import Dashboard from '../components/workorder/Dashboard';
import Logout from '../components/auth/Logout';
import '../styles/DashboardPage.css';

const DashboardPage = ({ setToken }) => {
  return (
    <div className="dashboard-page">
      {/* Header section with logout */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <Logout setToken={setToken} />
        </div>
      </header>

      {/* Main dashboard component */}
      <main className="dashboard-content">
        <Dashboard />
      </main>
    </div>
  );
};

// Props validation
DashboardPage.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default DashboardPage;
