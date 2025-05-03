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
import { formatCurrency } from '@/lib/utils';
import appData from '@/api/mock/data';

import { FileText, Users, User, CreditCard, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isBranchAdmin } = usePermissions();
  
  // Calculate dashboard statistics from actual data
  const calculateDashboardStats = () => {
    // Total policies
    const totalPolicies = appData.policy_holders.length;
    
    // Active policies
    const activePolicies = appData.policy_holders.filter(
      policy => policy.status === 'Active'
    ).length;
    
    // Total customers
    const totalCustomers = appData.customers.length;
    
    // Total agents
    const totalAgents = appData.sales_agents.length;
    
    // Total premium collected
    const totalPremiumCollected = appData.premium_payments.reduce(
      (total, payment) => total + parseFloat(payment.total_paid || '0'), 
      0
    );
    
    // Pending claims
    const pendingClaims = appData.claim_requests.filter(
      claim => claim.status === 'Pending'
    ).length;
    
    // Average premium
    const averagePremium = totalPolicies > 0 ? 
      totalPremiumCollected / totalPolicies : 0;
    
    // Due payments (remaining premium)
    const duePayments = appData.premium_payments.reduce(
      (total, payment) => total + parseFloat(payment.remaining_premium || '0'), 
      0
    );
    
    // Loan statistics
    const activeLoans = appData.loans.filter(loan => loan.loan_status === 'Active');
    const totalLoanAmount = activeLoans.reduce(
      (total, loan) => total + parseFloat(loan.loan_amount), 
      0
    );
    
    const totalRepayments = appData.loan_repayments.reduce(
      (total, repayment) => total + parseFloat(repayment.amount), 
      0
    );
    
    const pendingLoans = appData.loans.filter(
      loan => loan.loan_status === 'Pending'
    ).length;
    
    return {
      totalPolicies,
      activePolicies,
      totalCustomers,
      totalAgents,
      totalPremiumCollected,
      pendingClaims,
      averagePremium,
      duePayments,
      loanStats: {
        totalActiveLoans: activeLoans.length,
        totalLoanAmount,
        totalRepayments,
        pendingApprovals: pendingLoans
      }
    };
  };
  
  const stats = calculateDashboardStats();

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
              value={stats.totalPolicies.toString()}
              trend={{ value: "Based on policy holders data", positive: true }}
            />
            
            <StatsCard
              icon={<Users className="h-5 w-5" />}
              title="Total Customers"
              value={stats.totalCustomers.toString()}
              trend={{ value: "Registered customers", positive: true }}
            />
            
            <StatsCard
              icon={<User className="h-5 w-5" />}
              title="Total Agents"
              value={stats.totalAgents.toString()}
              trend={{ value: "Active sales agents", neutral: true }}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Total Premium Collected"
              value={formatCurrency(stats.totalPremiumCollected)}
              trend={{ value: "From all premium payments", positive: true }}
            />
          </div>
          
          {/* Additional stats for superadmin or branch manager */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <StatsCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Pending Claims"
              value={stats.pendingClaims.toString()}
              trend={{ value: "Awaiting processing", positive: false }}
            />
            
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Active Policies"
              value={stats.activePolicies.toString()}
              trend={{ value: "Currently active policies", positive: true }}
            />
            
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title={isSuperAdmin ? "Average Premium" : "Due Payments"}
              value={isSuperAdmin ? formatCurrency(stats.averagePremium) : formatCurrency(stats.duePayments)}
              trend={{ 
                value: isSuperAdmin ? "Per policy average" : "Remaining premium payments", 
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
