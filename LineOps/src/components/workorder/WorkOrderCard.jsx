import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/WorkOrderCard.css';

const WorkOrderCard = ({ order, onDoubleClick = () => {} }) => {
  // Initialize car details with loading state
  const [carDetails, setCarDetails] = useState({
    make: 'Loading...',
    model: 'Loading...',
    year: 'Loading...',
    licensePlate: 'Loading...',
    color: 'Loading...'
  });
  
  // Track loading and error states
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car details on mount
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!order?.carId) {
        setIsLoading(false);
        return;
      }

      // Fetch car details
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/cars/${order.carId}`,
          {
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch car details');
        
        const car = await response.json();
        setCarDetails(car);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching car details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch car details when carId changes
    fetchCarDetails();
  }, [order?.carId]);


  // Helper function to get status color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffd700', // yellow
      'InProgress': '#ff9800', // orange
      'Complete': '#4caf50', // green
    };
    return colors[status] || '#gray';
  };

  // Skip rendering invalid orders
  if (!order || !order.workOrderId) {
    console.warn('Invalid order data:', order);
    return null; // Skip rendering invalid orders
  }

  // Handle drag start event (for drag and drop)
  const handleDragStart = (e) => {
    e.dataTransfer.setData('orderId', order.workOrderId.toString());
    console.log("Dragging workorder:", {
      id: order.workOrderId,
      _id: order._id,
      status: order.status
    });
  };

  return (
    <div
      className="work-order-card"
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={() => onDoubleClick(order)}
    >
      {error && <div className="error-message">Error: {error}</div>}
      <div className="card-header">
        <h3 className="department">{order.department || 'Unknown Department'}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status}
        </span>
      </div>
      <div className="service-info">
        <h4 className="service-type">{order.serviceType || 'Unknown Service'}</h4>
        <small className="work-order-id">Work Order #{order.workOrderId}</small>
      </div>
      <div className="additional-info">
        <div className="info-column">
          <div>
            <span className="info-label">Car Details</span>
            <p className="info-value">{`${carDetails.year} ${carDetails.make} ${carDetails.model}`}</p>
          </div>
          <div>
            <span className="info-label">License Plate</span>
            <p className="info-value">{carDetails.licensePlate}</p>
          </div>
        </div>
        
        <div className="info-column">
          <div>
            <span className="info-label">Color</span>
            <p className="info-value">{carDetails.color}</p>
          </div>
          <div>
            <span className="info-label">Technician</span>
            <p className="info-value">{order.technicianAssigned || 'Unassigned'}</p>
          </div>
        </div>
        
        <div className="info-column">
          <span className="info-label">Tasks</span>
          <p className="info-value">{order.tasks?.length || 0} tasks</p>
        </div>
      </div>
    </div>
  );
};

// Prop type validation
WorkOrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    carId: PropTypes.string,
    department: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    workOrderId: PropTypes.number.isRequired,
    serviceType: PropTypes.string,
    technicianAssigned: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired
    }))
  }).isRequired,
  onDoubleClick: PropTypes.func
};

export default WorkOrderCard;
