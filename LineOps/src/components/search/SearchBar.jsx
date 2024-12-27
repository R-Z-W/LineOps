import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useDebounce from '../../hooks/useDebounce';
import './SearchBar.css';

// Entity type configurations
const ENTITY_TYPES = {
  workorders: { label: 'Work Orders', apiPath: 'workorders' },
  cars: { label: 'Cars', apiPath: 'cars' },
  users: { label: 'Users', apiPath: 'users' }
};

// Add scoring function at the top level
// Basic TF-IDF scoring function
// Based on the query and entity type, calculate a relevance score for each item
// The score is based on the number of times the query appears in the item's fields
// The score is higher if the query appears at the beginning of a field
// The score is higher for certain fields (e.g. serviceType for workorders)
// The score is higher if the query is an exact match for a field
// The score is used to sort and filter search results
const calculateRelevanceScore = (item, query, entityType) => {
  const searchQuery = query.toLowerCase();
  let score = 0;
  
  // Check entity type and fields
  switch (entityType) {
    case 'workorders': {
      // Check workorder fields
      const workOrderText = `
        ${item.workOrderId} 
        ${item.serviceType?.toLowerCase() || ''} 
        ${item.department?.toLowerCase() || ''}
      `;
      if (workOrderText.includes(searchQuery)) score += 2;
      if (item.serviceType?.toLowerCase().startsWith(searchQuery)) score += 3;
      break;
    }
      
    case 'cars': {
      // Check car fields
      const carText = `
        ${item.make?.toLowerCase() || ''} 
        ${item.model?.toLowerCase() || ''} 
        ${item.licensePlate?.toLowerCase() || ''}
      `;
      if (carText.includes(searchQuery)) score += 2;
      if (item.make?.toLowerCase().startsWith(searchQuery)) score += 3;
      if (item.model?.toLowerCase().startsWith(searchQuery)) score += 3;
      break;
    }
      
    case 'users': {
      // Check user fields
      const userText = `
        ${item.firstName?.toLowerCase() || ''} 
        ${item.lastName?.toLowerCase() || ''} 
        ${item.username?.toLowerCase() || ''}
      `;
      if (userText.includes(searchQuery)) score += 2;
      if (item.firstName?.toLowerCase().startsWith(searchQuery)) score += 3;
      if (item.lastName?.toLowerCase().startsWith(searchQuery)) score += 3;
      break;
    }
  }
  
  return score;
};

const SearchBar = ({ onSelect }) => {
  // Search state management
  const [query, setQuery] = useState('');
  const [entityType, setEntityType] = useState('workorders');
  const [results, setResults] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs for click outside handling
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Handle search API calls
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/${ENTITY_TYPES[entityType].apiPath}?search=${debouncedQuery}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        
        // Score and sort results by relevance as above
        const scoredResults = data
          .map(item => ({
            ...item,
            relevanceScore: calculateRelevanceScore(item, debouncedQuery, entityType)
          }))
          .filter(item => item.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 50); // Limit to top 50 (adjust as needed)
        
        setResults(scoredResults);
      } catch (err) {
        setError(`Failed to fetch results: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, entityType]);

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${ENTITY_TYPES[entityType].label}...`}
          className="search-input"
        />
        <select
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          className="entity-select"
        >
          {Object.entries(ENTITY_TYPES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && <div className="search-error">{error}</div>}
      
      {isLoading && <div className="search-loading">Loading...</div>}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((item) => (
            <div
              key={item._id}
              className="search-result-item"
              onClick={() => {
                onSelect(item, entityType);
                setQuery('');
                setResults([]);
              }}
            >
              {entityType === 'workorders' && `#${item.workOrderId} - ${item.serviceType}`}
              {entityType === 'cars' && `${item.make} ${item.model} (${item.licensePlate})`}
              {entityType === 'users' && `${item.firstName} ${item.lastName} (${item.jobTitle || 'No title'})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default SearchBar;