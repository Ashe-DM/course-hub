// UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, updateUserProfile } from '../api/authApi';

const UserContext = createContext();

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
        // Verify token is still valid using the API client
        try {
          const userData = await getCurrentUser(); // Uses the correct backend URL
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // Token invalid, clear storage
          console.error('Auth check failed:', error);
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
      const response = await loginUser({ email, password }); // Uses the correct backend URL

      if (response.success) {
        const { token, user } = response;
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
      const response = await registerUser({ name, email, password }); // Uses the correct backend URL

      if (response.success) {
        const { token, user } = response;
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
        const response = await updateUserProfile(updates); // Uses the correct backend URL
        
        if (response.success) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          return { success: true, user: response.user };
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
  const isMentor = () => user?.role === 'mentor' || user?.role === 'admin';
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
        isMentor,
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