import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => {
    // Initialize with users from localStorage or empty array
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    // Save users to localStorage whenever it changes
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

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

  const signup = (userData) => {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required for signup');
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user object
    const newUser = {
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      name: userData.name || userData.email.split('@')[0],
      ...userData
    };

    // Add user to users array
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const login = (credentials) => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required for login');
    }

    // Find user by email
    const user = users.find(user => user.email === credentials.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    if (user.password !== credentials.password) {
      throw new Error('Invalid password');
    }

    // Set authenticated user
    const { password, ...userWithoutPassword } = user;
    setIsAuthenticated(true);
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
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
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 