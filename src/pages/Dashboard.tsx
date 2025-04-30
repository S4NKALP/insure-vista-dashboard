
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

import { FileText, Users, User, CreditCard, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  
  return (
    <DashboardLayout title="Dashboard">
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
          {isSuperAdmin ? (
            <>
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
                title="Average Premium"
                value="Rs. 9,250"
                trend={{ value: "+5% from last month", positive: true }}
              />
            </>
          ) : (
            <>
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
                title="Due Payments"
                value="Rs. 35,750"
                trend={{ value: "+8% from last month", positive: false }}
              />
            </>
          )}
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
    </DashboardLayout>
  );
};

export default Dashboard;
