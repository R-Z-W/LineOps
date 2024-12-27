import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Modal.css';

// Constants for form validation and defaults
const REQUIRED_FIELDS = ['department', 'serviceType', 'carId'];
const DEPARTMENTS = [
  'Mechanical',
  'Dent Repair', 
  'Paint Shop',
  'Rim Repair',
  'Upholstery',
  'Detailing',
  'Inspection'
];

const WorkOrderModal = ({ workOrder, onClose, onSave }) => {
  // State for managing available cars
  const [cars, setCars] = useState([]);
  
  // State for form data and validation
  const [formData, setFormData] = useState(workOrder);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for task and comment inputs
  const [newTask, setNewTask] = useState('');
  const [newComment, setNewComment] = useState('');

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
      } catch (err) {
        setError(`Failed to load cars: ${err.message}`);
      }
    };
    fetchCars();
  }, []);

  // Add task to work order
  const addTask = () => {
    if (!newTask.trim()) return;
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { title: newTask.trim(), completed: false }]
    });
    setNewTask('');
  };

  // Remove task from work order
  const removeTask = (index) => {
    const updatedTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: updatedTasks });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingFields = REQUIRED_FIELDS.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      // Get user info from token
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Prepare work order data
      const workOrderData = {
        userId: payload.userId,
        ...formData,
        startDate: new Date().toISOString(),
        status: formData.status || 'Pending'
      };

      await onSave(workOrderData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Work Order #{workOrder.workOrderId}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Car *</label>
              <select
                value={formData.carId || ''}
                onChange={(e) => setFormData({...formData, carId: e.target.value})}
                required
              >
                <option value="">Select a Car</option>
                {cars.map(car => (
                  <option key={car._id} value={car._id}>
                    {car.year} {car.make} {car.model} - {car.licensePlate}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(department => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Service Type *</label>
              <input
                type="text"
                value={formData.serviceType}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Technician Assigned</label>
              <input
                type="text"
                value={formData.technicianAssigned}
                onChange={(e) => setFormData({...formData, technicianAssigned: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                required
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Tasks</label>
              <div className="task-input-group">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add new task"
                />
                <button type="button" onClick={addTask}>Add</button>
              </div>
              <div className="task-list">
                {formData.tasks?.map((task, index) => (
                  <div key={index} className="task-item">
                    <span>{task.title}</span>
                    <button type="button" onClick={() => removeTask(index)}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group full-width">
              <label>Comments</label>
              <div className="comments-section">
                {formData.comments?.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <span>{comment.text}</span>
                    <small>{new Date(comment.timestamp).toLocaleString()}</small>
                  </div>
                ))}
                <div className="comment-input-group">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newComment.trim()) return;
                      setFormData({
                        ...formData,
                        comments: [
                          ...formData.comments,
                          { text: newComment.trim(), timestamp: new Date() }
                        ]
                      });
                      setNewComment('');
                    }}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-footer">
            <button type="submit" className="save-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes validation
WorkOrderModal.propTypes = {
  workOrder: PropTypes.shape({
    _id: PropTypes.string,
    workOrderId: PropTypes.number,
    carId: PropTypes.string,
    department: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    technicianAssigned: PropTypes.string,
    status: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool
    })),
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string
    }))
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default WorkOrderModal;