
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the premium trend
const data = [
  { name: 'Jan', amount: 49000 },
  { name: 'Feb', amount: 60000 },
  { name: 'Mar', amount: 45000 },
  { name: 'Apr', amount: 68000 },
  { name: 'May', amount: 63000 },
  { name: 'Jun', amount: 75000 },
  { name: 'Jul', amount: 68000 },
  { name: 'Aug', amount: 80000 },
  { name: 'Sep', amount: 85000 },
  { name: 'Oct', amount: 92000 },
  { name: 'Nov', amount: 97000 },
  { name: 'Dec', amount: 105000 },
];

export const PremiumTrendChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Premium Collection Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value / 1000}k`}
                width={40}
              />
              <Tooltip 
                formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Amount']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#8a5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
