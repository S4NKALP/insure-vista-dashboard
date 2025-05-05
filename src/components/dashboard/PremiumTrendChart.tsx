import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/api/mock/api';
import { formatCurrency } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export const PremiumTrendChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{ month: string; premium: number }[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboardStats();
        
        if (response.success && response.data?.premiumTrend) {
          setChartData(response.data.premiumTrend);
        } else {
          // Fallback data if API doesn't provide the trend data
          setChartData([
            { month: "Jan", premium: 12500 },
            { month: "Feb", premium: 21500 },
            { month: "Mar", premium: 31500 },
            { month: "Apr", premium: 28900 },
            { month: "May", premium: 35600 },
            { month: "Jun", premium: 42050 },
            { month: "Jul", premium: 50300 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching premium trend data:', error);
        // Set fallback data on error
        setChartData([
          { month: "Jan", premium: 12500 },
          { month: "Feb", premium: 21500 },
          { month: "Mar", premium: 31500 },
          { month: "Apr", premium: 28900 },
          { month: "May", premium: 35600 },
          { month: "Jun", premium: 42050 },
          { month: "Jul", premium: 50300 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Premium Collection Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full aspect-[2/1]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 15,
                left: 15,
                bottom: 10,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                padding={{ left: 10 }}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="premium"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
