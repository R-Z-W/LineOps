import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Modal.css';

// Form field defaults and validation constants
const REQUIRED_FIELDS = ['make', 'model', 'year', 'vin', 'licensePlate'];
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD'];

const CarModal = ({ car, onClose, onSave }) => {
  // Initialize form state with car data or defaults
  const [formData, setFormData] = useState({
    make: car?.make || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    vin: car?.vin || '',
    licensePlate: car?.licensePlate || '',
    color: car?.color || '',
    engineType: car?.engineType || '',
    transmissionType: car?.transmissionType || 'Automatic',
    mileage: car?.mileage || 0,
    fuelType: car?.fuelType || 'Gasoline',
    price: car?.price || 0,
    condition: car?.condition || 'New',
    seatingCapacity: car?.seatingCapacity || 5,
    drivetrain: car?.drivetrain || 'FWD',
    status: car?.status || 'For Sale',
    location: car?.location || '',
    boughtDate: car?.boughtDate || new Date().toISOString()
  });

  // UI state management
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Format numerical values
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage) || 0,
        price: parseInt(formData.price) || 0,
        seatingCapacity: parseInt(formData.seatingCapacity) || 5
      };

      await onSave(carData);
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
          <h2>{car ? 'Edit Car' : 'Add New Car'}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Make *</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="form-group">
              <label>VIN *</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({...formData, vin: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>License Plate *</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Color *</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Engine Type</label>
              <input
                type="text"
                value={formData.engineType}
                onChange={(e) => setFormData({...formData, engineType: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Transmission Type</label>
              <select
                value={formData.transmissionType}
                onChange={(e) => setFormData({...formData, transmissionType: e.target.value})}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <input
                type="text"
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>
            <div className="form-group">
              <label>Seating Capacity</label>
              <input
                type="number"
                value={formData.seatingCapacity}
                onChange={(e) => setFormData({...formData, seatingCapacity: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Drivetrain</label>
              <select
                value={formData.drivetrain}
                onChange={(e) => setFormData({...formData, drivetrain: e.target.value})}
              >
                {DRIVETRAINS.map(drive => (
                  <option key={drive} value={drive}>{drive}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="For Sale">For Sale</option>
                <option value="Sold">Sold</option>
                <option value="In Service">In Service</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-footer">
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CarModal.propTypes = {
  car: PropTypes.shape({
    _id: PropTypes.string,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    vin: PropTypes.string.isRequired,
    licensePlate: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    engineType: PropTypes.string,
    transmissionType: PropTypes.string,
    mileage: PropTypes.number,
    fuelType: PropTypes.string,
    price: PropTypes.number,
    condition: PropTypes.string,
    seatingCapacity: PropTypes.number,
    drivetrain: PropTypes.string,
    status: PropTypes.string,
    location: PropTypes.string,
    boughtDate: PropTypes.string,
    soldDate: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default CarModal;