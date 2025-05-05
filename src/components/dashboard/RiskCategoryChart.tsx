import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getUnderwritingData } from '@/api/endpoints'; // Assuming an endpoint exists
import { UnderwritingData } from '@/types'; // Changed from Underwriting

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Function to fetch and process underwriting data for the chart
const fetchRiskCategoryData = async (): Promise<ChartData[]> => {
  console.log('Fetching underwriting data for risk chart...');
  const response = await getUnderwritingData(); // Need to add this API call
  console.log('RiskCategory API response:', response);

  if (response.success && response.data) {
    const underwritingData = response.data as UnderwritingData[];
    
    const riskColors: { [key: string]: string } = {
      'Low': '#10b981',
      'Moderate': '#f59e0b',
      'High': '#ef4444',
      'Very High': '#991b1b'
    };
    
    const riskCount = new Map<string, number>();
    underwritingData.forEach(item => {
      const riskCategory = item.risk_category;
      const count = riskCount.get(riskCategory) || 0;
      riskCount.set(riskCategory, count + 1);
    });
    
    const totalPolicies = underwritingData.length;
    const result = Array.from(riskCount).map(([name, count]): ChartData => ({
      name,
      value: totalPolicies > 0 ? Math.round((count / totalPolicies) * 100) : 0,
      color: riskColors[name] || '#6b7280'
    }));
    
    if (result.length === 0) {
      return [{ name: 'No Data', value: 100, color: '#6b7280' }];
    }
    return result;
  } else {
    throw new Error(response.message || 'Failed to fetch underwriting data');
  }
};

export const RiskCategoryChart = () => {
  const { 
    data: chartData = [{ name: 'Loading', value: 100, color: '#e2e8f0' }], // Default to loading state
    isLoading, 
    isError, 
    error 
  } = useQuery<ChartData[], Error>({
    queryKey: ['riskCategoryData'],
    queryFn: fetchRiskCategoryData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Category Distribution</CardTitle>
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
          <div className="h-[260px] flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    percent > 0 && name !== 'No Data' && name !== 'Loading' ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
