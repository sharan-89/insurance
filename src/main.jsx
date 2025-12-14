import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeAppData } from './utils/initApp.js'
import './styles/index.css'

// Initialize dummy data on app start
initializeAppData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

