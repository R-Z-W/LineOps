import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WorkOrderCard from './WorkOrderCard';
import SearchBar from '../search/SearchBar';
import WorkOrderModal from '../modals/WorkOrderModal';
import CarModal from '../modals/CarModal';
import UserModal from '../modals/UserModal';
import '../../styles/Dashboard.css';
import '../../styles/Modal.css';

/**
 * Dashboard Component
 * Main interface for managing work orders, users, and cars
 */

const Dashboard = ({ setToken }) => {
  const [modalType, setModalType] = useState(null);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin === true;
    } catch {
      return false;
    }
  };

  // Step 1: Update initial state
  const [workOrders, setWorkOrders] = useState({
    pending: [],
    inprogress: [], // Match backend format
    complete: []
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState(null);

  // Step 2: Update status mapping constant
  const STATUS_MAPPING = {
    'Pending': { display: 'Pending', backend: 'Pending' },
    'In Progress': { display: 'In Progress', backend: 'InProgress' },
    'Complete': { display: 'Complete', backend: 'Complete' }
  };

  // Update STATUS_MAP to match backend
  const STATUS_MAP = {
    pending: 'Pending',
    inprogress: 'InProgress',
    complete: 'Complete'
  };

  // Add empty templates near top of component
  const emptyWorkOrder = {
    department: 'Service',
    serviceType: '',
    status: 'Pending',
    tasks: [],
    comments: [],
    technicianAssigned: ''
  };

  // Entity Templates - Default values for new entities
  const ENTITY_TEMPLATES = {
    car: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      licensePlate: '',
      color: '',
      engineType: '',
      transmissionType: 'Automatic',
      mileage: 0,
      fuelType: 'Gasoline',
      price: 0,
      condition: 'New',
      seatingCapacity: 5,
      drivetrain: 'FWD',
      status: 'For Sale'
    },
    user: {
      firstName: '',
      lastName: '',
      username: '',
      jobTitle: '',
      department: '',
      email: '',
      phoneNumber: '',
      hireDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'Active'
    }
  };

  // Add creation handlers
  /**
   * Entity creation handler
   * @param {string} type - Entity type (car, user, workorder)
   * @param {Object} data - Entity data to create
   */
  const handleCreate = async (type, data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${type}s`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create ${type}`);
      }

      const newEntity = await response.json();

      // Update state based on entity type
      switch (type) {
        case 'workorder':
          setWorkOrders(prev => ({
            ...prev,
            pending: [...prev.pending, newEntity]
          }));
          break;
        case 'car':
          setCars(prev => [...prev, newEntity]);
          break;
        case 'user':
          setUsers(prev => [...prev, newEntity]);
          break;
      }

      setModalType(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Update data processing
  useEffect(() => {
    const fetchWorkOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/workorders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch work orders");
        const data = await response.json();
        const sortedOrders = { pending: [], inprogress: [], complete: [] };

        data.forEach(order => {
          if (order.status === 'InProgress') sortedOrders.inprogress.push(order);
          else if (order.status === 'Pending') sortedOrders.pending.push(order);
          else if (order.status === 'Complete') sortedOrders.complete.push(order);
        });

        setWorkOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        setWorkOrders({ pending: [], inprogress: [], complete: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkOrders();
  }, [setToken]);

  // Fetch cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/cars`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDrop = async (orderId, rawStatus) => {
    try {
      let orderToUpdate = null;
      let currentStatus = '';
      for (const [status, orders] of Object.entries(workOrders)) {
        const found = orders.find(order => order.workOrderId.toString() === orderId);
        if (found) {
          orderToUpdate = found;
          currentStatus = status;
          break;
        }
      }
      if (!orderToUpdate) return;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workorders/${orderToUpdate._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status: STATUS_MAP[rawStatus.toLowerCase()] })
        }
      );

      if (!response.ok) {
        throw new Error("Error updating work order");
      }
      const updatedOrder = await response.json();

      setWorkOrders(prev => {
        const updated = { ...prev };
        updated[currentStatus] = updated[currentStatus].filter(o => o.workOrderId !== +orderId);
        updated[rawStatus.toLowerCase()] = [...updated[rawStatus.toLowerCase()], updatedOrder];
        return updated;
      });
    } catch (error) {
      console.error('Error updating work order:', error);
    }
  };

  const handleEntitySelect = (entity, type) => {
    setSelectedEntity(entity);
    setEntityType(type);
  };

  const handleEntitySave = (updatedEntity) => {
    if (entityType === 'workorders') {
      // Update workOrders state
      setWorkOrders(prevOrders => {
        const updated = { ...prevOrders };
        const statusKey = updatedEntity.status.toLowerCase();
        updated[statusKey] = updated[statusKey].map(order => 
          order._id === updatedEntity._id ? updatedEntity : order
        );
        return updated;
      });
    }
    setSelectedEntity(null);
  };

  // Step 4: Update render logic
  if (isLoading) return <div>Loading work orders...</div>;
  if (error) return <div>Error: {error}</div>;

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

      {selectedEntity && entityType === 'workorders' && (
        <WorkOrderModal
          workOrder={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={handleEntitySave}
        />
      )}

      {selectedEntity && entityType === 'cars' && (
        <CarModal
          car={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={() => setSelectedEntity(null)}
        />
      )}

      {selectedEntity && entityType === 'users' && (
        <UserModal
          user={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={() => setSelectedEntity(null)}
        />
      )}

      {/* Creation Modals */}
      {modalType === 'workorder' && (
        <WorkOrderModal
          workOrder={emptyWorkOrder}
          cars={cars}
          users={users}
          onClose={() => setModalType(null)}
          onSave={(data) => handleCreate('workorder', data)}
        />
      )}

      {modalType === 'car' && (
        <CarModal
          car={ENTITY_TEMPLATES.car}
          onClose={() => setModalType(null)}
          onSave={(data) => handleCreate('car', data)}
        />
      )}

      {modalType === 'user' && isAdmin() && (
        <UserModal
          user={ENTITY_TEMPLATES.user}
          onClose={() => setModalType(null)}
          onSave={(data) => handleCreate('user', data)}
        />
      )}
    </div>
  );
};

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired
};

// Update modal prop types for each modal to handle new entries
// Example for WorkOrderModal:
WorkOrderModal.propTypes = {
  workOrder: PropTypes.shape({
    _id: PropTypes.string, // Make optional for new entries
    workOrderId: PropTypes.number, // Make optional for new entries
    department: PropTypes.string.isRequired,
    // ...other props...
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default Dashboard;