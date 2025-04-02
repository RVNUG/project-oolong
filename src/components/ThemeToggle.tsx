import { useTheme } from '../context/ThemeContext';
import '../assets/css/theme-toggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <i className="fas fa-moon" aria-hidden="true"></i>
      ) : (
        <i className="fas fa-sun" aria-hidden="true"></i>
      )}
    </button>
  );
};

export default ThemeToggle; 