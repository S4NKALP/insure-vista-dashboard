import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import appData from '@/api/mock/data';

// Generate claim status distribution data from actual claims
const generateClaimStatusData = () => {
  const { claim_requests } = appData;
  
  // Define status colors
  const statusColors = {
    'Approved': '#10b981',
    'Pending': '#f59e0b',
    'Rejected': '#ef4444',
    'Processing': '#6b7280',
    'In Review': '#3b82f6'
  };
  
  // Count claims by status
  const statusCount = new Map();
  
  claim_requests.forEach(claim => {
    const status = claim.status;
    const count = statusCount.get(status) || 0;
    statusCount.set(status, count + 1);
  });
  
  // Calculate percentages
  const totalClaims = claim_requests.length;
  const result = Array.from(statusCount).map(([name, count]) => ({
    name,
    value: totalClaims > 0 ? Math.round((count / totalClaims) * 100) : 0,
    color: statusColors[name] || '#6b7280' // Default color if status not in predefined colors
  }));
  
  // If there's no data, provide a default
  if (result.length === 0) {
    return [{ name: 'No Claims', value: 100, color: '#6b7280' }];
  }
  
  return result;
};

const data = generateClaimStatusData();

export const ClaimStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Status Distribution</CardTitle>
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
