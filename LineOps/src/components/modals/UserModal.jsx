
import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Modal.css';

// Required fields for user creation/editing
const REQUIRED_FIELDS = [
  'firstName', 'lastName', 'username', 'jobTitle',
  'department', 'email', 'phoneNumber', 'dateOfBirth',
  'gender', 'address', 'salary', 'password'
];

const UserModal = ({ user, onClose, onSave }) => {
  // Initialize form data with user or empty values
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    jobTitle: user?.jobTitle || '',
    department: user?.department || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    hireDate: user?.hireDate || new Date().toISOString().split('T')[0],
    salary: user?.salary || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    employmentStatus: user?.employmentStatus || 'Active',
    password: '',
    confirmPassword: '',
    isAdmin: user?.isAdmin || false
  });

  // Error state management
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Password validation
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      // Format user data for submission
      const userData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        hireDate: new Date(formData.hireDate).toISOString(),
        salary: Number(formData.salary)
      };

      // Validate required fields
      const missingFields = REQUIRED_FIELDS.filter(field => !userData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Submit user data
      await onSave(userData);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Create New User'}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Hire Date *</label>
              <input
                type="date"
                value={formData.hireDate?.split('T')[0]}
                onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Salary *</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth?.split('T')[0]}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Employment Status *</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                required
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                minLength={8}
                placeholder="Confirm password"
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-footer">
            <button type="submit" className="save-button" disabled={isSubmitting}>Save Changes</button>
            <button type="button" onClick={onClose} className="cancel-button" disabled={isSubmitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

UserModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    jobTitle: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    hireDate: PropTypes.string,
    salary: PropTypes.number,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    address: PropTypes.string,
    employmentStatus: PropTypes.string,
    password: PropTypes.string,
    isAdmin: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default UserModal;