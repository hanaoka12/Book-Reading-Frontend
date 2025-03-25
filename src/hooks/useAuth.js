import { useState, useEffect } from 'react';
import { decode as jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated, user };
};
