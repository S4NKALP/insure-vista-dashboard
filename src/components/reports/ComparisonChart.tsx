import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComparisonChartProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
  branchId: number | null;
}

type ChartType = 'bar' | 'radar';

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ timeRange, branchId }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  
  // Generate comparison data - compares top 5 branches
  const data = generateComparisonData(timeRange, branchId);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Branch Performance Comparison</h3>
        <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="radar">Radar Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[400px]">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, '']} />
              <Legend />
              <Bar dataKey="policies" name="Policies Sold" fill="#8884d8" />
              <Bar dataKey="premium" name="Premium (in 10,000s)" fill="#82ca9d" />
              <Bar dataKey="customers" name="New Customers" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="branch" />
              <PolarRadiusAxis />
              <Radar name="Policies Sold" dataKey="policies" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Premium (in 10,000s)" dataKey="premium" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="New Customers" dataKey="customers" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

function generateComparisonData(timeRange: 'weekly' | 'monthly' | 'yearly', selectedBranchId: number | null) {
  // Branch names
  const branches = ['Kathmandu Central', 'Pokhara', 'Biratnagar', 'Butwal', 'Dharan'];
  
  // Multipliers based on time range
  const policyMultiplier = timeRange === 'weekly' ? 5 : timeRange === 'monthly' ? 20 : 80;
  const premiumMultiplier = timeRange === 'weekly' ? 10 : timeRange === 'monthly' ? 50 : 200;
  const customerMultiplier = timeRange === 'weekly' ? 3 : timeRange === 'monthly' ? 15 : 60;
  
  // Generate data with realistic patterns
  return branches.map((branch, index) => {
    // Highlight the selected branch with better performance
    const isSelected = selectedBranchId === index + 1;
    const performanceBoost = isSelected ? 1.5 : 1;
    
    // First branch is HQ, so it performs better
    const isHQ = index === 0;
    const hqBoost = isHQ ? 1.3 : 1;
    
    // Different branches have different strengths
    const policyStrength = [1.2, 0.9, 1.1, 0.8, 1.0][index];
    const premiumStrength = [1.0, 1.2, 0.9, 1.1, 0.8][index];
    const customerStrength = [1.1, 1.0, 0.8, 1.2, 0.9][index];
    
    return {
      branch,
      policies: Math.floor(policyMultiplier * policyStrength * hqBoost * performanceBoost + Math.random() * 10),
      premium: Math.floor(premiumMultiplier * premiumStrength * hqBoost * performanceBoost + Math.random() * 20),
      customers: Math.floor(customerMultiplier * customerStrength * hqBoost * performanceBoost + Math.random() * 5),
    };
  });
}
