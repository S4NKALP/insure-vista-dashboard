import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { sampleData } from '@/utils/data';

interface BranchKPIsChartProps {
  branchId: number;
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const BranchKPIsChart: React.FC<BranchKPIsChartProps> = ({ branchId, timeRange }) => {
  // Generate data based on timeRange
  const data = generateBranchKPIData(timeRange, branchId);
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Key Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
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
              stroke="#8884d8"
              name="Policies Issued"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="customers"
              stroke="#ff8042"
              name="New Customers"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="premium"
              stroke="#82ca9d"
              name="Premium (thousands)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Generate time series data for branch KPIs
function generateBranchKPIData(timeRange: 'weekly' | 'monthly' | 'yearly', branchId: number) {
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
  
  // Find branch data
  const branch = sampleData.branches.find(b => b.id === branchId);
  const branchFactor = branch ? (branch.id % 3) + 0.8 : 1; // Some branches perform better
  
  // Base values that scale with timeRange
  const basePolicies = timeRange === 'weekly' ? 3 : timeRange === 'monthly' ? 12 : 45;
  const baseCustomers = timeRange === 'weekly' ? 2 : timeRange === 'monthly' ? 8 : 30;
  const basePremium = timeRange === 'weekly' ? 10 : timeRange === 'monthly' ? 40 : 160;
  
  // Create a growth pattern
  return periods.map((period, index) => {
    const growthFactor = 1 + (index * 0.05);
    
    return {
      period,
      policies: Math.floor(basePolicies * branchFactor * growthFactor + Math.random() * 5),
      customers: Math.floor(baseCustomers * branchFactor * growthFactor + Math.random() * 3),
      premium: Math.floor(basePremium * branchFactor * growthFactor + Math.random() * 10),
    };
  });
}
