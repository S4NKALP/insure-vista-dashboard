
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';

interface SideNavbarProps {
  collapsed: boolean;
}

export const SideNavbar: React.FC<SideNavbarProps> = ({ collapsed }) => {
  const { user } = useAuth();
  
  const isSuperadmin = user?.role === 'superadmin';
  
  const superadminLinks = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/companies', icon: <Building size={20} />, label: 'Companies' },
    { path: '/branches', icon: <Building size={20} />, label: 'Branches' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/policies', icon: <FileText size={20} />, label: 'Policies' },
    { path: '/reports', icon: <ChartBar size={20} />, label: 'Reports' },
    { path: '/claims', icon: <ClipboardCheck size={20} />, label: 'Claims' },
    { path: '/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];
  
  const branchLinks = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/agents', icon: <User size={20} />, label: 'Agents' },
    { path: '/policy-holders', icon: <FileText size={20} />, label: 'Policy Holders' },
    { path: '/claims', icon: <ClipboardCheck size={20} />, label: 'Claims' },
    { path: '/loans', icon: <CreditCard size={20} />, label: 'Loans' },
    { path: '/reports', icon: <ChartBar size={20} />, label: 'Reports' },
  ];
  
  const links = isSuperadmin ? superadminLinks : branchLinks;
  
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
          {links.map((link) => (
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
                {user?.role === 'superadmin' ? 'Super Admin' : user?.role}
              </p>
              <p className="text-xs mt-1 opacity-75">{user?.fullName}</p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
