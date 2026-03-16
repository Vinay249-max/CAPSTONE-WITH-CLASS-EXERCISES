import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="btn btn-ghost btn-icon theme-toggle-btn"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      
      <style>{`
        .theme-toggle-btn {
          color: ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--accent-purple)'};
          transition: transform 0.3s ease;
        }
        .theme-toggle-btn:hover {
          transform: rotate(15deg) scale(1.1);
          background: var(--bg-elevated);
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;
