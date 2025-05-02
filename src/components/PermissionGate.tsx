import React, { ReactNode } from 'react';
import { Permission, usePermissions } from '@/contexts/PermissionsContext';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 * 
 * @example
 * <PermissionGate permission="manage_branches">
 *   <Button>Add Branch</Button>
 * </PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGate; 