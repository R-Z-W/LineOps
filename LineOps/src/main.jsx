import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Development error reporting
if (import.meta.env.DEV) {
  console.log('Running in development mode');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Enable HMR for development using Vite's API
if (import.meta.hot) {
  import.meta.hot.accept();
}
