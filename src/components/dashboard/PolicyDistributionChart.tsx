import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getPolicyHolders } from '@/api/endpoints'; // Use endpoint export
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PolicyHolder } from '@/types';

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#8a5cf6', '#38bdf8', '#f43f5e', '#10b981', '#f59e0b'];

// Function to fetch and process policy holder data for chart
const fetchPolicyDistributionData = async (): Promise<ChartData[]> => {
  console.log('Fetching policy holder data for distribution chart...');
  const response = await getPolicyHolders();
  console.log('PolicyDistribution API response:', response);

  if (response.success && response.data) {
    const policyHolders = response.data as PolicyHolder[];
    
    const policyTypeCount = new Map<string, number>();
    policyHolders.forEach(policy => {
      // Safely access nested properties
      const policyType = policy.policy?.policy_type || 'Unknown'; 
      const count = policyTypeCount.get(policyType) || 0;
      policyTypeCount.set(policyType, count + 1);
    });
    
    const totalPolicies = policyHolders.length;
    const result = Array.from(policyTypeCount).map(([name, count]): ChartData => ({
      name,
      value: totalPolicies > 0 ? Math.round((count / totalPolicies) * 100) : 0
    }));
    
    if (result.length === 0) {
      return [{ name: 'No Data', value: 100 }];
    }
    return result;
  } else {
    throw new Error(response.message || 'Failed to fetch policy distribution data');
  }
};

export const PolicyDistributionChart = () => {
  const { 
    data: chartData = [{ name: 'Loading', value: 100 }], // Default to loading state
    isLoading, 
    isError, 
    error 
  } = useQuery<ChartData[], Error>({
    queryKey: ['policyDistributionData'],
    queryFn: fetchPolicyDistributionData,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Chart Data</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred.'}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    name !== 'No Data' && name !== 'Loading' && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {chartData[0]?.name !== 'No Data' && chartData[0]?.name !== 'Loading' && <Legend />} 
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
