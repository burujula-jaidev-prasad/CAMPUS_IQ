import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else navigate('/demo');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-icon" style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>🏢</div>
          <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
          <p>Login to manage your campus spaces</p>
        </div>

        {error && (
          <div id="loginError" style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="name@institution.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Log In</button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link></p>
        </div>

        <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg)', borderRadius: '10px', fontSize: '0.8rem' }}>
          <strong style={{ display: 'block', marginBottom: '4px' }}>💡 Demo Credentials:</strong>
          <p>Admin: admin@campusspace.com / admin123</p>
          <p style={{ marginTop: '2px' }}>Student: student@campusspace.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
