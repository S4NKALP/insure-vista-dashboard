
import React, { useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { branches } from '@/utils/data';

interface ComparisonChartProps {
  timeRange: 'weekly' | 'monthly' | 'yearly';
  branchId: number | null;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ timeRange, branchId }) => {
  const [chartType, setChartType] = useState<'premium' | 'policies' | 'claims'>('premium');

  // Generate comparison data based on timeRange
  const barChartData = generateComparisonData(timeRange, chartType, branchId);
  const lineChartData = transformToLineData(timeRange, chartType, branchId);
  const pieChartData = transformToPieData(chartType, branchId);

  return (
    <div className="space-y-4">
      <Tabs 
        value={chartType} 
        onValueChange={(value) => setChartType(value as 'premium' | 'policies' | 'claims')}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="pie">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar" className="mt-6">
          <div style={{ height: '400px' }}>
            <ResponsiveBar
              data={barChartData}
              keys={['current', 'previous']}
              indexBy="period"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={['#8a5cf6', '#d3d3d3']}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: timeRange === 'weekly' ? 'Day' : timeRange === 'monthly' ? 'Month' : 'Quarter',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: chartType === 'premium' ? 'Amount (Rs.)' : 'Count',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              role="application"
              ariaLabel="Comparison bar chart"
              tooltip={({ id, value, color }) => (
                <div
                  style={{
                    padding: 12,
                    background: '#ffffff',
                    color: '#333333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ color }}>■</span> {id}: {value}
                </div>
              )}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="line" className="mt-6">
          <div style={{ height: '400px' }}>
            <ResponsiveLine
              data={lineChartData}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Period',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: chartType === 'premium' ? 'Amount (Rs.)' : 'Count',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="pie" className="mt-6">
          <div style={{ height: '400px' }}>
            <ResponsivePie
              data={pieChartData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions to generate dummy data
function generateComparisonData(
  timeRange: 'weekly' | 'monthly' | 'yearly',
  chartType: 'premium' | 'policies' | 'claims',
  branchId: number | null
) {
  // Define period labels based on timeRange
  const periods = 
    timeRange === 'weekly' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
      : timeRange === 'monthly' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Q1', 'Q2', 'Q3', 'Q4'];
  
  // Generate random data for current and previous periods
  return periods.map(period => {
    const multiplier = chartType === 'premium' ? 10000 : 1;
    const baseValue = chartType === 'premium' ? 50000 : chartType === 'policies' ? 15 : 5;
    
    return {
      period,
      current: Math.floor(Math.random() * baseValue * multiplier) + baseValue,
      previous: Math.floor(Math.random() * (baseValue * 0.9) * multiplier) + (baseValue * 0.8),
    };
  });
}

function transformToLineData(
  timeRange: 'weekly' | 'monthly' | 'yearly',
  chartType: 'premium' | 'policies' | 'claims',
  branchId: number | null
) {
  const barData = generateComparisonData(timeRange, chartType, branchId);
  
  // Transform bar data to line data format
  return [
    {
      id: 'Current Period',
      color: '#8a5cf6',
      data: barData.map(d => ({ x: d.period, y: d.current })),
    },
    {
      id: 'Previous Period',
      color: '#d3d3d3',
      data: barData.map(d => ({ x: d.period, y: d.previous })),
    },
  ];
}

function transformToPieData(
  chartType: 'premium' | 'policies' | 'claims',
  branchId: number | null
) {
  // For pie chart, we'll show distribution by policy type or branch
  const labels = branchId 
    ? ['Term', 'Endowment', 'Whole Life', 'ULIP', 'Pension'] 
    : branches.map(b => b.name).slice(0, 5);
  
  return labels.map(label => {
    const value = Math.floor(Math.random() * 100) + 20;
    return {
      id: label,
      label,
      value,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
  });
}
