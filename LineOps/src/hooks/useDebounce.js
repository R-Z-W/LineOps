import { useState, useEffect } from 'react';

// Limits the rate at which a function can fire (reduce API calls)
// https://www.freecodecamp.org/news/debouncing-explained/
// Wait for a certain amount of time after the last event to execute a function
const useDebounce = (value, delay = 500) => {
  // Validate delay parameter

  if (typeof delay !== 'number' || delay < 0) {
    console.warn('useDebounce: delay must be a positive number');
    delay = 500; // Fall back to default delay
  }

  // State for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Create timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout on value/delay change or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run effect if value or delay changes

  return debouncedValue;
};

export default useDebounce;