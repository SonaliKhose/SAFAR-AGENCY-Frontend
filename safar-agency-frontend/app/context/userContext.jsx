// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import jwt from "jsonwebtoken";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwt.decode(token);
      setUsername(decodedToken.username);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem('authToken', token);
    const decodedToken = jwt.decode(token);
    setUsername(decodedToken.username);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
