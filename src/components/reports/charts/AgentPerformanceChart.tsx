
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface AgentPerformanceChartProps {
  branchId: number;
}

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ branchId }) => {
  // Sample data for agent performance
  const data = [
    { name: 'John Doe', policies: 12, premium: 855000 },
    { name: 'Jane Smith', policies: 9, premium: 620000 },
    { name: 'Mike Johnson', policies: 15, premium: 1050000 },
    { name: 'Sarah Williams', policies: 7, premium: 410000 },
    { name: 'David Brown', policies: 11, premium: 780000 },
  ];
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Top Performing Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'policies' ? `${value} Policies` : `Rs. ${value.toLocaleString()}`, 
                name === 'policies' ? 'Policies Sold' : 'Premium Generated'
              ]} 
            />
            <Bar name="Policies Sold" dataKey="policies" fill="#8884d8" />
            <Bar name="Premium Generated (Rs.)" dataKey="premium" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
