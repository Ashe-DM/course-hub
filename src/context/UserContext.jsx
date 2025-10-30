import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Verify token is still valid
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else if (storedUser) {
        // Fallback to stored user (for mock auth)
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        setUser(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock login if backend not ready
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const mockUser = {
          _id: '123',
          name: email.split('@')[0],
          email: email,
          avatar: email.charAt(0).toUpperCase(),
          role: 'student',
          careerGoal: 'Digital Marketing Specialist'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        setUser(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      // Fallback to mock register if backend not ready
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const mockUser = {
          _id: Date.now().toString(),
          name: name,
          email: email,
          avatar: name.charAt(0).toUpperCase(),
          role: 'student',
          careerGoal: ''
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const response = await axios.put(`${API_URL}/api/auth/profile`, updates, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return { success: true, user: response.data.user };
        }
      } else {
        // Mock update
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isInstructor = () => user?.role === 'instructor' || user?.role === 'admin';
  const isStudent = () => user?.role === 'student';

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading,
        login, 
        register,
        logout,
        updateProfile,
        isAdmin,
        isInstructor,
        isStudent,
        isAuthenticated: !!user
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;