import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getClaimRequests } from '@/api/endpoints'; // Use endpoint export
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClaimRequest } from '@/types'; // Import ClaimRequest type

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Define status colors
const statusColors: { [key: string]: string } = {
  'Approved': '#10b981',
  'Pending': '#f59e0b',
  'Rejected': '#ef4444',
  'Processing': '#6b7280',
  'In Review': '#3b82f6'
};

// Function to fetch and process claim data for the chart
const fetchClaimStatusData = async (): Promise<ChartData[]> => {
  console.log('Fetching claim data for status chart...');
  const response = await getClaimRequests();
  console.log('ClaimStatus API response:', response);

  if (response.success && response.data) {
    const claims = response.data as ClaimRequest[];
    
    const statusCount = new Map<string, number>();
    claims.forEach(claim => {
      const status = claim.status;
      const count = statusCount.get(status) || 0;
      statusCount.set(status, count + 1);
    });
    
    const totalClaims = claims.length;
    const result = Array.from(statusCount).map(([name, count]): ChartData => ({
      name,
      value: totalClaims > 0 ? Math.round((count / totalClaims) * 100) : 0,
      color: statusColors[name] || '#6b7280' // Default color
    }));
    
    if (result.length === 0) {
      return [{ name: 'No Claims', value: 100, color: '#6b7280' }];
    }
    return result;
  } else {
    throw new Error(response.message || 'Failed to fetch claim status data');
  }
};

export const ClaimStatusChart = () => {
  const { 
    data: chartData = [{ name: 'Loading', value: 100, color: '#e2e8f0' }], // Default loading state
    isLoading, 
    isError, 
    error 
  } = useQuery<ChartData[], Error>({
    queryKey: ['claimStatusData'],
    queryFn: fetchClaimStatusData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Status Distribution</CardTitle>
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
                    name !== 'No Claims' && name !== 'Loading' && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {chartData[0]?.name !== 'No Claims' && chartData[0]?.name !== 'Loading' && <Legend />} 
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
