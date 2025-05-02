import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { sampleData } from '@/utils/data';

interface AgentPerformanceChartProps {
  branchId: number;
  timeRange: 'weekly' | 'monthly' | 'yearly';
  agentId?: number; // Optional agentId to show a specific agent's performance
}

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ 
  branchId, 
  timeRange,
  agentId
}) => {
  // If agentId is provided, show individual agent performance over time
  if (agentId) {
    return renderAgentTimeSeriesChart(agentId, timeRange);
  }
  
  // Otherwise show comparison of multiple agents in the branch
  return renderBranchAgentsComparisonChart(branchId, timeRange);
};

// Render a time-series chart for a single agent
function renderAgentTimeSeriesChart(agentId: number, timeRange: 'weekly' | 'monthly' | 'yearly') {
  const agent = sampleData.sales_agents.find(a => a.id === agentId);
  if (!agent) {
    return <div>No agent data available</div>;
  }
  
  // Generate time periods based on timeRange
  let periods: string[] = [];
  
  if (timeRange === 'weekly') {
    periods = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeRange === 'monthly') {
    // Use last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    periods = Array(6).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });
  } else {
    // Yearly - use last 4 quarters
    periods = ['Q1', 'Q2', 'Q3', 'Q4'];
  }
  
  // Base values proportional to the agent's performance
  const basePolicies = parseInt(agent.total_policies_sold.toString()) / (timeRange === 'yearly' ? 4 : timeRange === 'monthly' ? 6 : 7);
  const baseCommission = parseInt(agent.commission_rate) * 10;
  
  // Generate realistic data with trends
  const data = periods.map((period, index) => {
    const growth = 1 + (index * 0.08);
    const randomFactor = 0.8 + (Math.random() * 0.4);
    
    return {
      period,
      policies: Math.max(1, Math.floor(basePolicies * growth * randomFactor)),
      premium: Math.floor(baseCommission * 100 * growth * randomFactor),
      commission: Math.floor(baseCommission * growth * randomFactor),
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="policies" 
          name="Policies Sold" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="commission" 
          name="Commission (thousands)" 
          stroke="#82ca9d" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Render a comparison chart for multiple agents in a branch
function renderBranchAgentsComparisonChart(branchId: number, timeRange: 'weekly' | 'monthly' | 'yearly') {
  // Filter agents for the specific branch
  const branchAgents = sampleData.sales_agents
    .filter(agent => agent.branch === branchId && agent.is_active)
    .slice(0, 5);
  
  // Generate performance data based on timeRange
  const multiplier = timeRange === 'weekly' ? 1 : timeRange === 'monthly' ? 4 : 12;
  
  // Create data for the chart
  const data = branchAgents.map(agent => ({
    name: agent.agent_name.split(' ')[0], // Just use first name to save space
    policies: agent.total_policies_sold * (Math.random() * 0.3 + 0.7) * multiplier,
    premium: parseInt(agent.commission_rate) * 100 * multiplier,
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="policies" name="Policies Sold" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="premium" name="Commission (thousands)" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
