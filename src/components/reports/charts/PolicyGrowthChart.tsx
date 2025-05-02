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

interface PolicyGrowthChartProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const PolicyGrowthChart: React.FC<PolicyGrowthChartProps> = ({ timeRange }) => {
  // Generate data based on the selected time range
  const data = generatePolicyGrowthData(timeRange);
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>New Policies vs Matured Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toString()} />
            <Legend />
            <Bar dataKey="newPolicies" name="New Policies" fill="#8884d8" />
            <Bar dataKey="maturedPolicies" name="Matured Policies" fill="#82ca9d" />
            <Bar dataKey="cancelledPolicies" name="Cancelled Policies" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Helper function to generate policy growth data
function generatePolicyGrowthData(timeRange: 'weekly' | 'monthly' | 'yearly') {
  let labels: string[] = [];
  
  if (timeRange === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeRange === 'monthly') {
    // Use last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    labels = Array(6).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });
  } else {
    // Yearly - use last 5 years
    const currentYear = new Date().getFullYear();
    labels = Array(5).fill(0).map((_, i) => String(currentYear - 4 + i));
  }
  
  // Generate realistic data with trends
  const baseNewPolicy = timeRange === 'weekly' ? 5 : timeRange === 'monthly' ? 20 : 100;
  const baseMaturedPolicy = timeRange === 'weekly' ? 2 : timeRange === 'monthly' ? 10 : 40;
  const baseCancelledPolicy = timeRange === 'weekly' ? 1 : timeRange === 'monthly' ? 5 : 15;
  
  // Create data with a growth trend
  return labels.map((name, index) => {
    const growth = 1 + (index * 0.1); // More growth over time
    return {
      name,
      newPolicies: Math.floor((baseNewPolicy * growth) + Math.random() * 10),
      maturedPolicies: Math.floor((baseMaturedPolicy * (1 + index * 0.05)) + Math.random() * 5),
      cancelledPolicies: Math.floor((baseCancelledPolicy * (1 - index * 0.02 + 0.1)) + Math.random() * 3),
    };
  });
}
