import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
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
    // Listen for localStorage changes (cross-tab and programmatic)
    const handleStorage = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const savedUser = localStorage.getItem('currentUser');
      if (authStatus === 'true' && savedUser) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(savedUser));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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

  const generateVerificationCode = () => {
    // Generate a 6-digit verification code
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email, code) => {
    try {
      const response = await fetch('http://localhost:5000/api/email/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      return {
        success: true,
        message: `We have sent a verification code to ${email}. Please check your email and enter the code below.`
      };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  };

  const updateUserEmail = async (newEmail) => {
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    // Check if email is already in use
    const emailExists = users.some(user => user.email === newEmail);
    if (emailExists) {
      throw new Error('Email is already in use');
    }

    // Generate and store verification code
    const code = generateVerificationCode();
    setVerificationCode(code);

    // Return verification response
    return await sendVerificationEmail(newEmail, code);
  };

  const verifyEmailUpdate = (code, newEmail) => {
    if (code !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    // Update user's email in users array
    const updatedUsers = users.map(user => {
      if (user.email === currentUser.email) {
        return { ...user, email: newEmail };
      }
      return user;
    });

    // Update current user
    const updatedUser = { ...currentUser, email: newEmail };

    // Update state and localStorage
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setVerificationCode(null);

    return true;
  };

  const deleteAccount = () => {
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    // Remove user from users array
    const updatedUsers = users.filter(user => user.email !== currentUser.email);
    setUsers(updatedUsers);

    // Clear current user and authentication status
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('currentUser');

    return true;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      signup,
      updateUserEmail,
      verifyEmailUpdate,
      deleteAccount,
      setIsAuthenticated,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 