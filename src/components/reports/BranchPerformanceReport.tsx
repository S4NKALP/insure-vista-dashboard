import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BranchKPIsChart } from './charts/BranchKPIsChart';
import { AgentPerformanceChart } from './charts/AgentPerformanceChart';
import { TopPoliciesTable } from './tables/TopPoliciesTable';
import { sampleData } from '@/utils/data';
import { FileText, Users, CreditCard, User, TrendingUp, Briefcase } from 'lucide-react';

interface BranchPerformanceReportProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
  branchId: number;
}

export const BranchPerformanceReport: React.FC<BranchPerformanceReportProps> = ({ 
  timeRange, 
  branchId 
}) => {
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch branch data - in a real app this would be from an API
    const foundBranch = sampleData.branches.find(b => b.id === branchId);
    setBranch(foundBranch);
    setLoading(false);
  }, [branchId]);
  
  // Calculate stats for the branch
  const stats = {
    totalPolicies: timeRange === 'yearly' ? 287 : timeRange === 'monthly' ? 42 : 8,
    activeAgents: timeRange === 'yearly' ? 15 : timeRange === 'monthly' ? 12 : 10,
    revenueGrowth: timeRange === 'yearly' ? 21 : timeRange === 'monthly' ? 12 : 4,
    averagePremium: timeRange === 'yearly' ? 35400 : timeRange === 'monthly' ? 34200 : 33800,
  };
  
  if (loading) {
    return <div className="py-10 text-center">Loading branch data...</div>;
  }
  
  if (!branch) {
    return <div className="py-10 text-center">Branch not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold">{branch.name}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {branch.branch_code}
        </span>
      </div>
      
      <p className="text-muted-foreground">
        Location: {branch.location} | Company: {branch.company_name}
      </p>
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FileText className="h-5 w-5" />}
          title="Total Policies"
          value={stats.totalPolicies.toString()}
          trend={{ value: "+12% from previous period", positive: true }}
        />
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          title="Active Agents"
          value={stats.activeAgents.toString()}
          trend={{ value: "+3 from previous period", positive: true }}
        />
        <StatsCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Revenue Growth"
          value={`${stats.revenueGrowth}%`}
          trend={{ value: "+2% from previous period", positive: true }}
        />
        <StatsCard
          icon={<Briefcase className="h-5 w-5" />}
          title="Avg. Premium"
          value={`Rs. ${stats.averagePremium.toLocaleString()}`}
          trend={{ value: "+5% from previous period", positive: true }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchKPIsChart branchId={branchId} timeRange={timeRange} />
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Branch Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <AgentPerformanceChart branchId={branchId} timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
      
      {/* Agent List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Agent Name</th>
                  <th scope="col" className="px-6 py-3">Policies Sold</th>
                  <th scope="col" className="px-6 py-3">Premium Collected</th>
                  <th scope="col" className="px-6 py-3">Commission</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.sales_agents
                  .filter(agent => agent.branch === branchId)
                  .slice(0, 5)
                  .map((agent, index) => (
                    <tr key={agent.id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">{agent.agent_name}</td>
                      <td className="px-6 py-4">{agent.total_policies_sold}</td>
                      <td className="px-6 py-4">Rs. {(parseInt(agent.commission_rate) * 10000).toLocaleString()}</td>
                      <td className="px-6 py-4">Rs. {(parseInt(agent.commission_rate) * 100 * agent.total_policies_sold).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
