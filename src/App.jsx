import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Demo from './pages/Demo';
import Admin from './pages/Admin';
import Business from './pages/Business';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) return <Navigate to="/login" />;
  
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  
  return children;
};

// Public Route Guard (Redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return children; // For students, we still allow them to see the home page
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Layout><Home /></Layout></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Layout><Login /></Layout></PublicRoute>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/business" element={<Business />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="/demo" element={
            <ProtectedRoute role="student">
              <Demo />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
