
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyKPIsChart } from './charts/CompanyKPIsChart';
import { PremiumDistributionChart } from './charts/PremiumDistributionChart';
import { PolicyGrowthChart } from './charts/PolicyGrowthChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { FileText, Users, CreditCard, AlertTriangle } from 'lucide-react';

interface CompanyOverviewReportProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const CompanyOverviewReport: React.FC<CompanyOverviewReportProps> = ({ timeRange }) => {
  // Stats would normally be calculated based on timeRange
  const stats = {
    totalPolicies: timeRange === 'yearly' ? 867 : timeRange === 'monthly' ? 94 : 24,
    activeCustomers: timeRange === 'yearly' ? 752 : timeRange === 'monthly' ? 86 : 21,
    premiumCollected: timeRange === 'yearly' ? 9856750 : timeRange === 'monthly' ? 876550 : 215400,
    pendingClaims: timeRange === 'yearly' ? 35 : timeRange === 'monthly' ? 12 : 5,
  };

  const trendValue = {
    policies: timeRange === 'yearly' ? '+15%' : timeRange === 'monthly' ? '+8%' : '+3%',
    customers: timeRange === 'yearly' ? '+12%' : timeRange === 'monthly' ? '+5%' : '+2%',
    premium: timeRange === 'yearly' ? '+18%' : timeRange === 'monthly' ? '+10%' : '+4%',
    claims: timeRange === 'yearly' ? '-5%' : timeRange === 'monthly' ? '-2%' : '+1%',
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
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
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Pending Claims"
          value={stats.pendingClaims.toString()}
          trend={{ 
            value: `${trendValue.claims} from previous ${timeRange.slice(0, -2)}`, 
            positive: trendValue.claims.includes('-')
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyKPIsChart timeRange={timeRange} />
        <PremiumDistributionChart />
      </div>
      
      <PolicyGrowthChart timeRange={timeRange} />
    </div>
  );
};
