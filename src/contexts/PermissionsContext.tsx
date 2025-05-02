import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth, UserRole } from './AuthContext';

// Define permission types
export type Permission = 
  // Branch management
  | 'view_all_branches'
  | 'manage_branches'
  
  // Agent management
  | 'view_agents' 
  | 'manage_agents'
  | 'view_agent_applications'
  | 'manage_agent_applications'
  
  // Customer management
  | 'view_customers'
  | 'manage_customers'
  | 'view_all_customers'
  
  // User management
  | 'manage_users'
  | 'manage_admin_users'
  
  // Policy management
  | 'view_policies'
  | 'manage_policies'
  | 'view_policy_holders'
  | 'manage_policy_holders'
  | 'view_all_policy_holders'
  
  // Premium management
  | 'view_premium_payments'
  | 'manage_premium_payments'
  | 'view_all_premium_payments'
  
  // Claims management
  | 'view_claims'
  | 'manage_claims'
  | 'view_all_claims'
  | 'process_claims'
  
  // Loan management
  | 'view_loans'
  | 'manage_loans'
  | 'view_all_loans'
  
  // KYC management
  | 'view_kyc'
  | 'manage_kyc'
  | 'view_all_kyc'
  
  // Underwriting
  | 'view_underwriting'
  | 'manage_underwriting'
  
  // Configuration
  | 'manage_configuration';

interface PermissionsContextType {
  hasPermission: (permission: Permission) => boolean;
  userBranchId: string | null;
  isBranchAdmin: boolean;
  isSuperAdmin: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const userBranchId = useMemo(() => {
    return user?.branchId || null;
  }, [user]);
  
  const isBranchAdmin = useMemo(() => {
    return user?.role === 'branch';
  }, [user]);
  
  const isSuperAdmin = useMemo(() => {
    return user?.role === 'superadmin';
  }, [user]);
  
  // Define permissions based on user role
  const hasPermission = (permission: Permission): boolean => {
    // If no user, no permissions
    if (!user) return false;
    
    // SuperAdmin has all permissions
    if (user.role === 'superadmin') return true;
    
    // Branch Admin permissions
    if (user.role === 'branch') {
      switch (permission) {
        // Branch admins can view but not manage branches
        case 'view_all_branches':
          return false;
        
        // Agent management (only for their branch)
        case 'view_agents':
        case 'manage_agents':
        case 'view_agent_applications':
        case 'manage_agent_applications':
          return true;
        
        // Customer management (only for their branch)
        case 'view_customers':
        case 'manage_customers':
          return true;
        case 'view_all_customers':
          return false;
          
        // User management (can manage customers but not admin users)
        case 'manage_users':
          return true;
        case 'manage_admin_users':
          return false;
        
        // Policy management
        case 'view_policies':
          return true;
        case 'manage_policies':
          return false;
        case 'view_policy_holders':
        case 'manage_policy_holders':
          return true;
        case 'view_all_policy_holders':
          return false;
        
        // Premium management (only for their branch)
        case 'view_premium_payments':
        case 'manage_premium_payments':
          return true;
        case 'view_all_premium_payments':
          return false;
        
        // Claims management (only for their branch)
        case 'view_claims':
        case 'manage_claims':
          return true;
        case 'view_all_claims':
          return false;
        case 'process_claims':
          return true;
        
        // Loan management (only for their branch)
        case 'view_loans':
        case 'manage_loans':
          return true;
        case 'view_all_loans':
          return false;
        
        // KYC management (only for their branch)
        case 'view_kyc':
        case 'manage_kyc':
          return true;
        case 'view_all_kyc':
          return false;
        
        // Underwriting (view only for their branch)
        case 'view_underwriting':
          return true;
        case 'manage_underwriting':
          return false;
        
        // Configuration (not allowed)
        case 'manage_configuration':
          return false;
        
        default:
          return false;
      }
    }
    
    // Default deny for all other roles
    return false;
  };
  
  const value = {
    hasPermission,
    userBranchId,
    isBranchAdmin,
    isSuperAdmin
  };
  
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}; 