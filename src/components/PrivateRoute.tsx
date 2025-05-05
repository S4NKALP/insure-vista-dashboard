import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  
  // Verify authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    console.log('PrivateRoute - Auth check:', { 
      isAuthenticated, 
      hasUser: !!user, 
      hasToken: !!token,
      userRole: user?.role,
      isLoading
    });
    
    // If we have a token but no user, we might need to wait for auth state
    if (token && !user && !isLoading) {
      console.warn('Token exists but no user available - possible auth state issue');
    }
    
    // Only set verified when fully loaded and authenticated
    if (!isLoading) {
      setIsVerified(true);
    }
  }, [isAuthenticated, user, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insurance-purple"></div>
      </div>
    );
  }
  
  // Wait until verification is complete
  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-insurance-purple"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login');
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('Unauthorized role, redirecting to unauthorized page');
    // Redirect to unauthorized page if user doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
