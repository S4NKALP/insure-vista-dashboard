import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PremiumDistributionChart: React.FC = () => {
  // Sample data for premium distribution by policy type
  const data = [
    { name: 'Endowment', value: 4500000 },
    { name: 'Term Life', value: 2700000 },
    { name: 'Whole Life', value: 1800000 },
    { name: 'Money Back', value: 2500000 },
    { name: 'Child Plans', value: 1200000 },
  ];
  
  // Format number with commas for tooltip
  const formatValue = (value: number) => `Rs. ${value.toLocaleString()}`;
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Premium Distribution by Policy Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatValue(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
