import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Dashboard.css';
import '../../styles/Modal.css';



const Dashboard = ({ setToken }) => {
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Work Order Dashboard</h1>
        <div className="header-controls">
          <div className="action-buttons">
            <button 
              className="create-button"
              onClick={() => setModalType('workorder')}
            >
              New Work Order
            </button>
            <button 
              className="create-button"
              onClick={() => setModalType('car')}
            >
              New Car
            </button>
            {isAdmin() && (
              <button 
                className="create-button admin"
                onClick={() => setModalType('user')}
              >
                New User
              </button>
            )}
          </div>
          <SearchBar onSelect={handleEntitySelect} />
          <button 
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('token');
              setToken(null);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );};

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired
};


export default Dashboard;
