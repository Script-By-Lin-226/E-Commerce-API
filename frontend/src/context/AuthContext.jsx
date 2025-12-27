import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Fake users for frontend-only authentication (no backend call)
const FAKE_USERS = {
  'admin@demo.com': {
    password: 'admin123',
    email: 'admin@demo.com',
    username: 'Admin User',
    role: 'admin',
    id: 1
  },
  'user@demo.com': {
    password: 'user123',
    email: 'user@demo.com',
    username: 'Demo User',
    role: 'user',
    id: 2
  },
  'sale@demo.com': {
    password: 'sale123',
    email: 'sale@demo.com',
    username: 'Sale Manager',
    role: 'sale',
    id: 3
  },
  'hr@demo.com': {
    password: 'hr123',
    email: 'hr@demo.com',
    username: 'HR Manager',
    role: 'hr',
    id: 4
  },
  'demo@test.com': {
    password: 'demo123',
    email: 'demo@test.com',
    username: 'Demo Account',
    role: 'user',
    id: 5
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if fake user is stored in localStorage
    const storedFakeUser = localStorage.getItem('fake_user');
    const storedFakeToken = localStorage.getItem('fake_token');
    
    if (storedFakeUser && storedFakeToken) {
      try {
        const fakeUser = JSON.parse(storedFakeUser);
        setUser({
          email: fakeUser.email,
          username: fakeUser.username,
          role: fakeUser.role,
          id: fakeUser.id
        });
      } catch (error) {
        console.error('Error parsing stored fake user:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Check fake users first (no backend call)
    const fakeUser = FAKE_USERS[credentials.email.toLowerCase()];
    
    if (fakeUser && fakeUser.password === credentials.password) {
      // Fake login - no API call
      const fakeResponse = {
        access_token: `fake_token_${fakeUser.id}_${Date.now()}`,
        token_type: 'bearer'
      };
      
      // Set fake user in state
      setUser({
        email: fakeUser.email,
        username: fakeUser.username,
        role: fakeUser.role,
        id: fakeUser.id
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('fake_user', JSON.stringify(fakeUser));
      localStorage.setItem('fake_token', fakeResponse.access_token);
      
      return fakeResponse;
    }
    
    // If not a fake user, try real backend authentication
    try {
      const response = await authAPI.login(credentials);
      // User info might be in response or we can decode from token
      setUser({ email: credentials.email }); // Simplified
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // Clear fake user data
    localStorage.removeItem('fake_user');
    localStorage.removeItem('fake_token');
    
    // Try real logout if not fake user
    if (!localStorage.getItem('fake_user')) {
      try {
        await authAPI.logout();
      } catch (error) {
        // Ignore logout errors for fake users
        console.log('Logout error (may be fake user):', error);
      }
    }
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

