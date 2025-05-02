import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Shield } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building,
  ClipboardCheck,
  CreditCard,
  Settings,
  ChartBar,
  User,
  Banknote,
  Receipt,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  permission?: string;
}

interface SideNavbarProps {
  collapsed: boolean;
}

export const SideNavbar: React.FC<SideNavbarProps> = ({ collapsed }) => {
  const { user } = useAuth();
  const { isSuperAdmin, isBranchAdmin, hasPermission } = usePermissions();
  
  // Navigation items with permissions
  const navItems: NavItem[] = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/agents', icon: <User size={20} />, label: 'Agents', permission: 'view_agents' },
    { path: '/branches', icon: <Building size={20} />, label: 'Branches', permission: 'view_all_branches' },
    { path: '/users', icon: <Users size={20} />, label: 'Users', permission: 'view_all_customers' },
    { path: '/customers', icon: <Users size={20} />, label: 'Customers', permission: 'view_customers' },
    { path: '/policies', icon: <FileText size={20} />, label: 'Insurance Policies', permission: 'view_policies' },
    { path: '/policy-holders', icon: <FileText size={20} />, label: 'Policy Holders', permission: 'view_policy_holders' },
    { path: '/loans', icon: <Banknote size={20} />, label: 'Loans', permission: 'view_loans' },
    { path: '/claims', icon: <ClipboardCheck size={20} />, label: 'Claims', permission: 'view_claims' },
    { path: '/payments', icon: <CreditCard size={20} />, label: 'Payments', permission: 'view_claims' },
    { path: '/premium-payments', icon: <Receipt size={20} />, label: 'Premium Payments', permission: 'view_premium_payments' },
    { path: '/reports', icon: <ChartBar size={20} />, label: 'Reports' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings', permission: 'manage_configuration' },
  ];
  
  // Filter navigation items based on permissions
  const filteredLinks = navItems.filter(item => {
    // If no permission is required, show the item
    if (!item.permission) return true;
    
    // Check if the user has the required permission
    return hasPermission(item.permission as any);
  });
  
  return (
    <aside
      className={cn(
        "h-screen bg-sidebar transition-all duration-300 border-r border-gray-200 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-gray-200",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <Shield className="h-8 w-8 text-white flex-shrink-0" />
        {!collapsed && (
          <span className="text-white font-semibold ml-3 text-lg">
            Easy Life Insurance
          </span>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {filteredLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 rounded-lg text-sidebar-foreground",
                  isActive 
                    ? "bg-sidebar-accent font-semibold" 
                    : "hover:bg-sidebar-accent/50",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <span>{link.icon}</span>
                {!collapsed && <span className="ml-3">{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className={cn(
        "p-4 border-t border-gray-700",
        collapsed ? "text-center" : ""
      )}>
        <div className="text-sm text-white opacity-75 truncate">
          {!collapsed && (
            <>
              <p className="font-semibold capitalize">
                {isSuperAdmin ? 'Super Admin' : (isBranchAdmin ? 'Branch Admin' : user?.role)}
              </p>
              <p className="text-xs mt-1 opacity-75">
                {user?.fullName}
                {isBranchAdmin && user?.branchName && (
                  <span className="block mt-1">{user.branchName}</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
