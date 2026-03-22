import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo" style={{ color: 'white', gap: '0', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div className="logo-icon" style={{ background: 'transparent', height: '60px', display: 'flex', alignItems: 'center' }}>
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Campus IQ" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
              </div>
            </div>
            <p>Smart space management platform for universities, hospitals, and corporate campuses.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/demo">Live Demo</Link>
            <Link to="/business">How It Works</Link>
            <Link to="#">Analytics</Link>
            <Link to="#">Booking System</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/reviews">Reviews</Link>
            <Link to="/contact">Contact</Link>
            <Link to="#">About Us</Link>
            <Link to="#">Careers</Link>
          </div>
          <div className="footer-col">
            <h4>Industries</h4>
            <Link to="#">Universities</Link>
            <Link to="#">Hospitals</Link>
            <Link to="#">Corporate</Link>
            <Link to="#">Co-working</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Campus IQ. All rights reserved.</span>
          <span>Every Space Matter 🏫</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
