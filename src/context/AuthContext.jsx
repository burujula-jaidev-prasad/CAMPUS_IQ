import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (role) {
      setUser({ role, name });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // 1. Check Hardcoded Demo Credentials
    if (email === 'admin@campusspace.com' && password === 'admin123') {
      const userData = { role: 'admin', name: 'Admin' };
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      setUser(userData);
      return { success: true, role: 'admin' };
    }

    if (email === 'student@campusspace.com' && password === 'student123') {
      const userData = { role: 'student', name: 'Student' };
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      setUser(userData);
      return { success: true, role: 'student' };
    }

    // 2. Check Dynamic Users (from Signup)
    const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { role: foundUser.role, name: foundUser.name };
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      setUser(userData);
      return { success: true, role: foundUser.role };
    }

    return { success: false, message: 'Incorrect details. Please try again.' };
  };

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    users.push(userData);
    localStorage.setItem('campusUsers', JSON.stringify(users));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
