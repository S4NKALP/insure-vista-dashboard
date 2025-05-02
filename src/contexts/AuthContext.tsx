import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'superadmin' | 'branch' | 'agent' | 'customer';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  token: string;
  branchId?: string;
  branchName?: string;
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
  if (context === undefined) {
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
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call to authenticate user
      // In production, this would be a real API call to your backend
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, hard-code some auth logic
      if (username === 'admin' && password === 'password') {
        const userData: User = {
          id: '1',
          username: 'admin',
          fullName: 'Admin Admin',
          role: 'superadmin',
          token: 'mock-token-superadmin',
        };
        
        setUser(userData);
        
        // Save to local storage
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        toast.success('Logged in successfully');
        setIsLoading(false);
        return true;
      } else if (username === 'branch' && password === 'password') {
        const userData: User = {
          id: '2',
          username: 'branch',
          fullName: 'Branch Manager',
          role: 'branch',
          token: 'mock-token-branch',
          branchId: 'branch-1',
          branchName: 'Kohalpur Branch',
        };
        
        setUser(userData);
        
        // Save to local storage
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        toast.success('Logged in successfully');
        setIsLoading(false);
        return true;
      } else {
        toast.error('Invalid username or password');
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
    
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (role === 'superadmin') {
        const userData: User = {
          id: '1',
          username: 'admin',
          fullName: 'Admin Admin',
          role: 'superadmin',
          token: 'mock-token-superadmin',
        };
        
        setUser(userData);
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        toast.success('Logged in as Super Admin');
        setIsLoading(false);
        return true;
      } else if (role === 'branch') {
        const userData: User = {
          id: '2',
          username: 'branch',
          fullName: 'Branch Manager',
          role: 'branch',
          token: 'mock-token-branch',
          branchId: 'branch-1',
          branchName: 'Kohalpur Branch',
        };
        
        setUser(userData);
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        toast.success('Logged in as Branch Manager');
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
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
