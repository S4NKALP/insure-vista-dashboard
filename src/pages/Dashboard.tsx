import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { formatCurrency } from '@/lib/utils';
import { getDashboardStats } from '@/api/endpoints'; // Use endpoint export

import { FileText, Users, User, CreditCard, AlertTriangle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Default stats structure
const defaultStats = {
  totalPolicies: 0,
  activePolicies: 0,
  totalCustomers: 0,
  totalAgents: 0,
  totalPremiumCollected: 0,
  pendingClaims: 0,
  averagePremium: 0,
  duePayments: 0,
  loanStats: {
    totalActiveLoans: 0,
    totalLoanAmount: 0,
    totalRepayments: 0,
    pendingApprovals: 0
  }
};

// Function to fetch and process dashboard data
const fetchDashboardData = async () => {
  console.log('Fetching dashboard data...');
  try {
    const response = await getDashboardStats();
    console.log('Dashboard API response:', response);
    
    // First check if response exists and has success property
    if (!response || response.success === false) {
      throw new Error(response?.message || 'Failed to fetch dashboard data');
    }
    
    // Once we know response is successful, extract and process data
    const data = response.data || {};
    
    // Process and return structured stats with fallbacks for missing values
    return {
      totalPolicies: data.totalPolicies || 0,
      activePolicies: data.activePolicies || 0,
      totalCustomers: data.totalCustomers || 0,
      totalAgents: data.totalAgents || 0,
      totalPremiumCollected: data.totalPremium || 0,
      pendingClaims: data.pendingClaims || 0,
      averagePremium: data.totalPolicies > 0 ? data.totalPremium / data.totalPolicies : 0,
      duePayments: data.duePayments || 0,
      loanStats: {
        totalActiveLoans: data.activeLoans || 0,
        totalLoanAmount: data.totalLoanAmount || 0,
        totalRepayments: data.totalRepayments || 0,
        pendingApprovals: data.pendingLoans || 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error; // Re-throw to let React Query handle it
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isBranchAdmin } = usePermissions();
  
  const { 
    data: stats = defaultStats, // Provide default stats while loading or on error
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 1 // Retry once on failure
  });

  // Add debug output to help troubleshoot
  console.log('Current stats:', stats);
  console.log('Is loading:', isLoading);
  console.log('Is error:', isError);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {isBranchAdmin ? `Welcome to ${user?.branchName || 'your branch'} dashboard` : 'Welcome to your insurance dashboard'}
          </p>
        </div>
        
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard Stats</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred.'} Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Total Policies"
              value={stats.totalPolicies.toString()}
              trend={{ value: "Based on policy holders data", positive: true }}
              isLoading={isLoading}
            />
            
            <StatsCard
              icon={<Users className="h-5 w-5" />}
              title="Total Customers"
              value={stats.totalCustomers.toString()}
              trend={{ value: "Registered customers", positive: true }}
              isLoading={isLoading}
            />
            
            <StatsCard
              icon={<User className="h-5 w-5" />}
              title="Total Agents"
              value={stats.totalAgents.toString()}
              trend={{ value: "Active sales agents", neutral: true }}
              isLoading={isLoading}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Total Premium Collected"
              value={formatCurrency(stats.totalPremiumCollected)}
              trend={{ value: "From all premium payments", positive: true }}
              isLoading={isLoading}
            />
          </div>
          
          {/* Additional stats */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <StatsCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Pending Claims"
              value={stats.pendingClaims.toString()}
              trend={{ value: "Awaiting processing", positive: false }}
              isLoading={isLoading}
            />
            
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Active Policies"
              value={stats.activePolicies.toString()}
              trend={{ value: "Currently active policies", positive: true }}
              isLoading={isLoading}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title={isSuperAdmin ? "Average Premium" : "Due Payments"}
              value={isSuperAdmin ? formatCurrency(stats.averagePremium) : formatCurrency(stats.duePayments)}
              trend={{ 
                value: isSuperAdmin ? "Per policy average" : "Remaining premium payments", 
                positive: isSuperAdmin
              }}
              isLoading={isLoading}
            />
          </div>
          
          {/* Charts - These components might need internal loading/error handling too */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <PremiumTrendChart />
            <PolicyDistributionChart />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <ClaimStatusChart />
            <RiskCategoryChart />
          </div>
          
          {/* Tables - These components will also need error/loading handling */}
          <RecentPoliciesTable />
          <RecentClaimsTable />
        </div>
        
        {/* Loan Overview - Assuming LoansDashboard handles its own loading/errors */}
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