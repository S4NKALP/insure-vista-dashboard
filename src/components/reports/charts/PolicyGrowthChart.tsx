
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface PolicyGrowthChartProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const PolicyGrowthChart: React.FC<PolicyGrowthChartProps> = ({ timeRange }) => {
  // Generate data based on the selected time range
  const data = generateGrowthData(timeRange);
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Policy Growth Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} Policies`, 'Total']} />
            <Area type="monotone" dataKey="policies" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Helper function to generate growth data
function generateGrowthData(timeRange: 'weekly' | 'monthly' | 'yearly') {
  let labels: string[] = [];
  let baseValue = 0;
  let increment = 0;
  
  if (timeRange === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    baseValue = 680;
    increment = 5;
  } else if (timeRange === 'monthly') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    baseValue = 600;
    increment = 25;
  } else {
    // Yearly data (showing last 5 years)
    labels = ['2021', '2022', '2023', '2024', '2025'];
    baseValue = 400;
    increment = 100;
  }
  
  return labels.map((name, index) => ({
    name,
    policies: baseValue + (increment * index) + Math.floor(Math.random() * increment),
  }));
}
