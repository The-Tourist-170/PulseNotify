import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded); 

        setUser({
          name: decoded.sub,
          role: decoded.roles, 
        });
        localStorage.setItem('token', token);
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  const isAdmin = Array.isArray(user?.role) && user.role.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);