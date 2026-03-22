import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = signup(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F0FDF4 100%)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-icon" style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>🏢</div>
          <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
          <p>Join 12+ institutions managing smarter</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', border: '1px solid #A7F3D0', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="john@university.edu" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Institution Name</label>
            <input type="text" name="institution" placeholder="Christ University" value={formData.institution} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
