import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import appData from '@/api/mock/data';

// Generate risk category distribution data from actual underwriting data
const generateRiskCategoryData = () => {
  const { underwriting } = appData;
  
  // Define risk category colors
  const riskColors = {
    'Low': '#10b981',
    'Moderate': '#f59e0b',
    'High': '#ef4444',
    'Very High': '#991b1b'
  };
  
  // Count policies by risk category
  const riskCount = new Map();
  
  underwriting.forEach(item => {
    const riskCategory = item.risk_category;
    const count = riskCount.get(riskCategory) || 0;
    riskCount.set(riskCategory, count + 1);
  });
  
  // Calculate percentages
  const totalPolicies = underwriting.length;
  const result = Array.from(riskCount).map(([name, count]) => ({
    name,
    value: totalPolicies > 0 ? Math.round((count / totalPolicies) * 100) : 0,
    color: riskColors[name] || '#6b7280' // Default color if risk not in predefined colors
  }));
  
  // If there's no data, provide a default
  if (result.length === 0) {
    return [{ name: 'No Data', value: 100, color: '#6b7280' }];
  }
  
  return result;
};

const data = generateRiskCategoryData();

export const RiskCategoryChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
