
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BranchKPIsChart } from './charts/BranchKPIsChart';
import { AgentPerformanceChart } from './charts/AgentPerformanceChart';
import { TopPoliciesTable } from './tables/TopPoliciesTable';
import { branches } from '@/utils/data';
import { FileText, Users, CreditCard, User } from 'lucide-react';

interface BranchPerformanceReportProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
  branchId: number;
}

export const BranchPerformanceReport: React.FC<BranchPerformanceReportProps> = ({ 
  timeRange, 
  branchId 
}) => {
  const branch = branches.find(b => b.id === branchId) || branches[0];
  
  // Stats would normally be calculated based on timeRange and branchId
  const stats = {
    totalPolicies: timeRange === 'yearly' ? 234 : timeRange === 'monthly' ? 46 : 12,
    activeCustomers: timeRange === 'yearly' ? 201 : timeRange === 'monthly' ? 39 : 10,
    premiumCollected: timeRange === 'yearly' ? 2856750 : timeRange === 'monthly' ? 235500 : 59800,
    activeAgents: timeRange === 'yearly' ? 12 : timeRange === 'monthly' ? 8 : 4,
  };

  const trendValue = {
    policies: timeRange === 'yearly' ? '+12%' : timeRange === 'monthly' ? '+6%' : '+2%',
    customers: timeRange === 'yearly' ? '+10%' : timeRange === 'monthly' ? '+5%' : '+1%',
    premium: timeRange === 'yearly' ? '+15%' : timeRange === 'monthly' ? '+8%' : '+3%',
    agents: timeRange === 'yearly' ? '+5%' : timeRange === 'monthly' ? '0%' : '0%',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{branch.name} Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<FileText className="h-5 w-5" />}
              title="Total Policies"
              value={stats.totalPolicies.toString()}
              trend={{ value: `${trendValue.policies} from previous ${timeRange.slice(0, -2)}`, positive: true }}
            />
            <StatsCard
              icon={<Users className="h-5 w-5" />}
              title="Active Customers"
              value={stats.activeCustomers.toString()}
              trend={{ value: `${trendValue.customers} from previous ${timeRange.slice(0, -2)}`, positive: true }}
            />
            <StatsCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Premium Collected"
              value={`Rs. ${stats.premiumCollected.toLocaleString()}`}
              trend={{ value: `${trendValue.premium} from previous ${timeRange.slice(0, -2)}`, positive: true }}
            />
            <StatsCard
              icon={<User className="h-5 w-5" />}
              title="Active Agents"
              value={stats.activeAgents.toString()}
              trend={{ 
                value: `${trendValue.agents} from previous ${timeRange.slice(0, -2)}`, 
                positive: !trendValue.agents.includes('-'),
                neutral: trendValue.agents === '0%'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <BranchKPIsChart branchId={branchId} timeRange={timeRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPerformanceChart branchId={branchId} />
        <TopPoliciesTable branchId={branchId} timeRange={timeRange} />
      </div>
    </div>
  );
};
