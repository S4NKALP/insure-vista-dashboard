
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
  ResponsiveContainer 
} from 'recharts';

interface BranchKPIsChartProps {
  branchId: number;
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const BranchKPIsChart: React.FC<BranchKPIsChartProps> = ({ branchId, timeRange }) => {
  // Generate data based on the selected time range
  const data = generateBranchKPIData(timeRange);
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Branch Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="New Policies" dataKey="newPolicies" stackId="a" fill="#8884d8" />
            <Bar name="Renewed Policies" dataKey="renewedPolicies" stackId="a" fill="#82ca9d" />
            <Bar name="Claims" dataKey="claims" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Helper function to generate branch KPI data
function generateBranchKPIData(timeRange: 'weekly' | 'monthly' | 'yearly') {
  let labels: string[] = [];
  
  if (timeRange === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeRange === 'monthly') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  } else {
    // Yearly - use quarterly data
    labels = ['Q1', 'Q2', 'Q3', 'Q4'];
  }
  
  // Generate dummy data based on timeRange
  const baseNewPolicy = timeRange === 'weekly' ? 3 : timeRange === 'monthly' ? 8 : 30;
  const baseRenewedPolicy = timeRange === 'weekly' ? 7 : timeRange === 'monthly' ? 20 : 80;
  const baseClaim = timeRange === 'weekly' ? 1 : timeRange === 'monthly' ? 4 : 15;
  
  return labels.map((name) => ({
    name,
    newPolicies: Math.floor(Math.random() * baseNewPolicy) + baseNewPolicy,
    renewedPolicies: Math.floor(Math.random() * baseRenewedPolicy) + baseRenewedPolicy,
    claims: Math.floor(Math.random() * baseClaim) + baseClaim,
  }));
}
