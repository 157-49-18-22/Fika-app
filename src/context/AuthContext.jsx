import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    if (authStatus === 'true' && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.email) {
          throw new Error('Invalid user data');
        }
        setIsAuthenticated(true);
        setCurrentUser(parsedUser);
      } catch (error) {
        // If there's an error parsing the user data, clear it
        localStorage.removeItem('currentUser');
        localStorage.setItem('isAuthenticated', 'false');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    if (!userData) {
      throw new Error('User data is required for login');
    }

    let userObject;
    
    if (typeof userData === 'string') {
      // If userData is a string, treat it as an email
      userObject = {
        email: userData,
        name: userData.split('@')[0] // Use part before @ as name
      };
    } else if (typeof userData === 'object') {
      // If userData is an object, ensure it has an email
      if (!userData.email) {
        throw new Error('Email is required for login');
      }
      userObject = {
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        ...userData
      };
    } else {
      throw new Error('Invalid user data format');
    }

    setIsAuthenticated(true);
    setCurrentUser(userObject);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userObject));
  };

  const logout = () => {
    const currentUserEmail = currentUser?.email;
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 