import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { login as apiLogin, logout as apiLogout } from '@/api/mock/api';

export type UserRole = 'superadmin' | 'branch' | 'agent' | 'customer';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserRole;
  token?: string;
  branch?: number | null;
  branchName?: string;
  // Additional properties
  fullName?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: (role: UserRole) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth data on component mount
    const savedAuth = localStorage.getItem('auth');
    const token = localStorage.getItem('auth_token');
    
    if (savedAuth && token) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
        console.log('Restored auth state from localStorage, token exists:', !!token);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth');
        localStorage.removeItem('auth_token');
      }
    } else {
      // If missing either auth data or token, clear both to be safe
      if (savedAuth || token) {
        console.warn('Inconsistent auth state, clearing both auth and token');
        localStorage.removeItem('auth');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Attempting to login with username: ${username}`);
      const response = await apiLogin(username, password);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        const userData = response.data;
        
        // Format user data to match our expected format
        const formattedUser: User = {
          ...userData,
          fullName: `${userData.first_name} ${userData.last_name}`,
          role: userData.user_type as UserRole,
          // If we have a branchId, get the branch name - this would need to be enhanced
          // with an API call in a real implementation
          branchName: userData.branch ? `Branch #${userData.branch}` : undefined
        };
        
        setUser(formattedUser);
        
        // Save to local storage
        localStorage.setItem('auth', JSON.stringify({ user: formattedUser }));
        
        // Double check that we have the token saved (should be handled in the API layer)
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.error('Auth token not found after login, authentication may fail');
        } else {
          console.log('Auth token successfully stored');
        }
        
        toast.success('Logged in successfully');
        setIsLoading(false);
        return true;
      } else {
        toast.error(response.message || 'Invalid username or password');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };
  
  const demoLogin = async (role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Set default demo credentials based on role
    const username = role === 'superadmin' ? 'admin' : 'kohalpurBranch';
    const password = 'password123'; // Demo password
    
    try {
      console.log(`Demo login with role: ${role}, username: ${username}`);
      // Use the actual login API for demo logins
      const success = await login(username, password);
      return success;
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call API logout
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API result
      setUser(null);
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_token');
      toast.success('Logged out successfully');
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
