import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import appData from '@/api/mock/data';

// Generate policy distribution data from actual policies
const generatePolicyDistribution = () => {
  const { policy_holders } = appData;
  
  // Count policies by type
  const policyTypeCount = new Map();
  
  policy_holders.forEach(policy => {
    const policyType = policy.policy.policy_type;
    const count = policyTypeCount.get(policyType) || 0;
    policyTypeCount.set(policyType, count + 1);
  });
  
  // Calculate percentages
  const totalPolicies = policy_holders.length;
  const result = Array.from(policyTypeCount).map(([name, count]) => ({
    name,
    value: totalPolicies > 0 ? Math.round((count / totalPolicies) * 100) : 0
  }));
  
  // If there's no data, provide a default
  if (result.length === 0) {
    return [{ name: 'No Data', value: 100 }];
  }
  
  return result;
};

const data = generatePolicyDistribution();
const COLORS = ['#8a5cf6', '#38bdf8', '#f43f5e', '#10b981', '#f59e0b'];

export const PolicyDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
