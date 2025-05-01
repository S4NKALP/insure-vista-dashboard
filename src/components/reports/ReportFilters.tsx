
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { branches } from '@/utils/data';

type TimeRange = 'weekly' | 'monthly' | 'yearly';

interface ReportFiltersProps {
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (value: TimeRange) => void;
  selectedBranchId: number | null;
  setSelectedBranchId: (value: number | null) => void;
  showBranchFilter: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedTimeRange,
  setSelectedTimeRange,
  selectedBranchId,
  setSelectedBranchId,
  showBranchFilter,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Time Range</label>
            <Select
              value={selectedTimeRange}
              onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showBranchFilter && (
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">Branch</label>
              <Select
                value={selectedBranchId?.toString() || ''}
                onValueChange={(value) => 
                  setSelectedBranchId(value === 'all' ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
