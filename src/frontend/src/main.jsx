// Importing necessary modules from 'react' and 'react-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Importing the main App component

/**
 * Entry point of the application responsible for rendering the main App component into the DOM.
 * @module
 */

/**
 * Renders the main App component into the root element.
 * @function
 * @returns {void}
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrapping the App component with React.StrictMode to highlight potential issues
  <React.StrictMode>
    <App /> {/* Rendering the main App component */}
  </React.StrictMode>,
);
