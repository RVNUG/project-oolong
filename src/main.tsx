import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/css/fontawesome-custom.css'
import './assets/css/theme.css'
import './index.css'
import { registerServiceWorker } from './js/registerSW'

// Register service worker for PWA capabilities
registerServiceWorker();

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  console.error('Root element not found');
} 