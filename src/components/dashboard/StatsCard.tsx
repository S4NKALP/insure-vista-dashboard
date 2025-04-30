
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  trend
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4">
            <span className={cn(
              "text-xs font-semibold rounded-full px-2 py-0.5",
              trend.positive ? "bg-green-100 text-green-700" : 
              trend.neutral ? "bg-gray-100 text-gray-700" : 
              "bg-red-100 text-red-700"
            )}>
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
