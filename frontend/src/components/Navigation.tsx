import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>AyurDiscovery AI</h1>
          <span className="nav-subtitle">Multi-Agent Drug Discovery Platform</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/agents" 
              className={location.pathname === '/agents' ? 'nav-link active' : 'nav-link'}
            >
              Agent Management
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;