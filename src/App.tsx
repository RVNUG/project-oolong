import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { routes } from './config/routes';
import './assets/css/main.css';

// Get basename from environment variables or default to ''
const basename = import.meta.env.VITE_APP_BASE_URL || '';

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <Router basename={basename}>
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App; 