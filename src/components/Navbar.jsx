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
          <div className="logo-icon" style={{ background: 'transparent', height: '54px', display: 'flex', alignItems: 'center' }}>
            <img src={`${import.meta.env.BASE_URL}logo_brand.png`} alt="Campus IQ" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Every Space Matter</span>
        </Link>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {user ? (
            <>
              <li>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--dark)',
                  padding: '6px 12px',
                  background: '#EFF6FF',
                  borderRadius: '999px',
                  border: '1px solid #BFDBFE'
                }}>
                  <span style={{
                    width: '26px', height: '26px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  {user.name}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1.5px solid var(--danger)',
                    color: 'var(--danger)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.target.style.background = 'var(--danger)'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--danger)'; }}
                >
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={location.pathname === '/login' ? 'active' : ''}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="nav-cta" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </li>
            </>
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
