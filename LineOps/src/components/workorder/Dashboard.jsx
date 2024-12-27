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
          <div className="dashboard-content">
            {Object.entries(STATUS_MAPPING).map(([key, { display, backend }]) => {
              const statusKey = backend === 'InProgress' ? 'inprogress' : backend.toLowerCase();
              const workOrderList = workOrders[statusKey] || [];
              
              return (
                <div
                  key={key}
                  className="status-column"
                  onDrop={(e) => {
                    const orderId = e.dataTransfer.getData('orderId');
                    handleDrop(orderId, backend);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="column-header">
                    <h2>{display}</h2>
                  </div>
                  <div className="column-content">
                    {workOrderList.map((order) => (
                      <WorkOrderCard
                        key={order.workOrderId}
                        order={order}
                        onDoubleClick={(clickedOrder) => {
                          setSelectedEntity(clickedOrder);
                          setEntityType('workorders');
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired
};


export default Dashboard;
