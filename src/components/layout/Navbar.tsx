import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Upload, MapPin, LayoutDashboard, Star, Bell, LogOut, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType') || '';
  const isMithra = userType === 'mithra';

  let navLinks = [
    { name: 'Explore', path: '/explore', icon: <MapPin size={18} /> },
    ...(!isMithra ? [{ name: 'Donate', path: '/upload', icon: <Upload size={18} /> }] : []),
    { name: isMithra ? 'Deliveries' : 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Alerts', path: '/notifications', icon: <Bell size={18} /> },
    { name: 'Profile', path: '/profile', icon: <Star size={18} /> },
  ];

  if (!isAuthenticated) {
    navLinks.unshift({ name: 'Login', path: '/', icon: <LogIn size={18} /> });
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleRestrictedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginPopup(true);
    setTimeout(() => setShowLoginPopup(false), 3000);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'on-landing' : ''}`}>
        <div className="navbar-container">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
            <img src="/annamithralogo.jpeg" alt="AnnaMithra" className="navbar-logo-img" />
            <span className="logo-text">AnnaMithra</span>
          </Link>
          <div className="navbar-links">
            {navLinks.map((link) => {
              const isRestricted = !isAuthenticated && link.name !== 'Login';
              return (
                <Link
                  key={link.name}
                  to={isRestricted ? '#' : link.path}
                  onClick={isRestricted ? handleRestrictedClick : undefined}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${isRestricted ? 'disabled-link' : ''}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <button onClick={handleLogout} className="nav-logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {showLoginPopup && (
        <div className="login-restricted-popup">
          <div className="login-restricted-content">
            <span className="popup-icon">🔒</span>
            <p>KINDLY LOGIN FIRST TO ACCESS THIS TAB</p>
          </div>
        </div>
      )}
    </>
  );
};
