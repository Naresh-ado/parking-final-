import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import './Header.css';

const Header = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="header glass-panel">
        <div className="container header-content">
          <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🅿️</span>
            <h1>SmartPark</h1>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link" onClick={() => onNavigate('home')}>Home</a>
            {user?.role === 'admin' && (
              <a href="#" className="nav-link" onClick={() => onNavigate('admin')}>Admin Page</a>
            )}

            {user ? (
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(true)}>Login</button>
            )}
          </nav>
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;
