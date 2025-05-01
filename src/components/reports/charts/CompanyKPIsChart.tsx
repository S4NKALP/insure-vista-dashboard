
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CompanyKPIsChartProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const CompanyKPIsChart: React.FC<CompanyKPIsChartProps> = ({ timeRange }) => {
  // Generate data based on the selected time range
  const data = generateTimeSeriesData(timeRange);
  
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="policies"
              stroke="#8884d8"
              name="Policies"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="claims"
              stroke="#82ca9d"
              name="Claims"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="premium"
              stroke="#ffc658"
              name="Premium (Rs.)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Helper function to generate time series data
function generateTimeSeriesData(timeRange: 'weekly' | 'monthly' | 'yearly') {
  let labels: string[] = [];
  
  if (timeRange === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeRange === 'monthly') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  } else {
    // Yearly - use quarterly data
    labels = ['Q1', 'Q2', 'Q3', 'Q4'];
  }
  
  // Generate dummy data based on timeRange
  const basePolicy = timeRange === 'weekly' ? 5 : timeRange === 'monthly' ? 25 : 100;
  const baseClaim = timeRange === 'weekly' ? 1 : timeRange === 'monthly' ? 10 : 40;
  const basePremium = timeRange === 'weekly' ? 50000 : timeRange === 'monthly' ? 250000 : 1000000;
  
  return labels.map((name, index) => ({
    name,
    policies: Math.floor(Math.random() * basePolicy) + basePolicy,
    claims: Math.floor(Math.random() * baseClaim) + baseClaim,
    premium: Math.floor(Math.random() * basePremium) + basePremium,
  }));
}
