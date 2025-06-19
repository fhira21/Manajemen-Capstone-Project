import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Ensure you have a CSS file for global styles
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
