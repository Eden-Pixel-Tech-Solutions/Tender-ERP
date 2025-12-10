// Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, BarChart3, Settings, Menu, X, ChevronRight } from 'lucide-react';
import '../assets/css/Navbar.css';
import Logo from '../assets/images/logo.png';

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'tenders', icon: FileText, label: 'Tenders', path: '/tenders' },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: '/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo-box">
              <img src={Logo} alt="Logo" className="sidebar-logo-img" />
            </div>
            {!isCollapsed && (
              <div className="sidebar-logo-text">
                <h2 className="sidebar-title">Meril Tender</h2>
                <p className="sidebar-subtitle">Automation</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="sidebar-toggle-btn"
              aria-label="Collapse sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="sidebar-expand-btn"
            aria-label="Expand sidebar"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeLink === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveLink(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {isActive && !isCollapsed && <div className="nav-item-indicator" />}
              <Icon size={20} className="nav-item-icon" />
              {!isCollapsed && (
                <>
                  <span className="nav-item-label">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="nav-item-arrow" />}
                </>
              )}
              {isCollapsed && isActive && <div className="nav-item-indicator-collapsed" />}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">U</div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">User Account</p>
              <p className="user-email">admin@meril.com</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}