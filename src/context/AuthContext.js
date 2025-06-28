import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, logout as logoutFromStorage } from '../data/localStorage';

// Create the context
const AuthContext = createContext();

// Create the Auth Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check localStorage for user data when the app loads
  useEffect(() => {
    try {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error getting stored user data:', error);
      logoutFromStorage(); // Clear any corrupted data
    }
    
    // Set loading to false after checking authentication
    setLoading(false);
  }, []);
  
  // Login function
  const login = (userData) => {
    setUser(userData);
    setCurrentUser(userData); // Use localStorage.js function
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    logoutFromStorage(); // Use localStorage.js function
  };
  
  // The value to be provided to consumers of this context
  const authContextValue = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };
  
  // Only render children after checking authentication
  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading ? children : <LoadingScreen />}
    </AuthContext.Provider>
  );
}

// Simple loading component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    </div>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}