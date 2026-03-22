import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Business', path: '/business' },
    { name: 'Demo', path: '/demo' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav>
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" style={{ gap: '12px', display: 'flex', alignItems: 'center' }}>
          <div className="logo-icon flex items-center justify-center p-1 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20" style={{ height: '44px', width: '44px', overflow: 'hidden' }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo_brand.png`} 
              alt="Campus IQ" 
              className="h-full w-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-indigo-900 tracking-tight leading-none uppercase">Campus IQ</span>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em] mt-1">Every Space Matter</span>
          </div>
        </Link>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {user ? (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-grad-primary flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline py-2 px-5 text-xs text-red-500 border-red-100 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link to="/demo" className="btn btn-primary py-2.5 px-6 text-xs" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </ul>

        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
