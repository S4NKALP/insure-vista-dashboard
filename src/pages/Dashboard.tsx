import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PremiumTrendChart } from '@/components/dashboard/PremiumTrendChart';
import { PolicyDistributionChart } from '@/components/dashboard/PolicyDistributionChart';
import { ClaimStatusChart } from '@/components/dashboard/ClaimStatusChart';
import { RiskCategoryChart } from '@/components/dashboard/RiskCategoryChart';
import { RecentPoliciesTable } from '@/components/dashboard/RecentPoliciesTable';
import { RecentClaimsTable } from '@/components/dashboard/RecentClaimsTable';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import { LoansDashboard } from '@/components/loans/LoansDashboard';

import { FileText, Users, User, CreditCard, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isBranchAdmin } = usePermissions();
  
  // In a real app, these would come from an API
  const loanStats = {
    totalActiveLoans: 1,
    totalLoanAmount: 25000,
    totalRepayments: 12000,
    pendingApprovals: 0,
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {isBranchAdmin ? `Welcome to ${user?.branchName || 'your branch'} dashboard` : 'Welcome to your insurance dashboard'}
          </p>
        </div>
        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Total Policies"
              value="2"
              trend={{ value: "+5% from last month", positive: true }}
            />
            
            <StatsCard
              icon={<Users className="h-5 w-5" />}
              title="Total Customers"
              value="3"
              trend={{ value: "+2% from last month", positive: true }}
            />
            
            <StatsCard
              icon={<User className="h-5 w-5" />}
              title="Total Agents"
              value="1"
              trend={{ value: "Same as last month", neutral: true }}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Total Premium Collected"
              value="Rs. 231,250"
              trend={{ value: "+15% from last month", positive: true }}
            />
          </div>
          
          {/* Additional stats for superadmin or branch manager */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <StatsCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Pending Claims"
              value="1"
              trend={{ value: "-5% from last month", positive: false }}
            />
            
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Active Policies"
              value="2"
              trend={{ value: "+15% from last month", positive: true }}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title={isSuperAdmin ? "Average Premium" : "Due Payments"}
              value={isSuperAdmin ? "Rs. 9,250" : "Rs. 35,750"}
              trend={{ 
                value: isSuperAdmin ? "+5% from last month" : "+8% from last month", 
                positive: isSuperAdmin
              }}
            />
          </div>
          
          {/* Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <PremiumTrendChart />
            <PolicyDistributionChart />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <ClaimStatusChart />
            <RiskCategoryChart />
          </div>
          
          {/* Tables */}
          <RecentPoliciesTable />
          <RecentClaimsTable />
        </div>
        
        <PermissionGate permission="view_loans">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Loan Overview</h3>
            <LoansDashboard />
          </div>
        </PermissionGate>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
