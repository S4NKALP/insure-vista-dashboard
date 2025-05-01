
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BranchPerformanceReport } from '@/components/reports/BranchPerformanceReport';
import { CompanyOverviewReport } from '@/components/reports/CompanyOverviewReport';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ComparisonChart } from '@/components/reports/ComparisonChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimeRange = 'weekly' | 'monthly' | 'yearly';

const Reports = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('monthly');
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
    !isSuperAdmin && user?.branchId ? parseInt(user.branchId) : null
  );

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Report Filters */}
        <ReportFilters 
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          selectedBranchId={selectedBranchId}
          setSelectedBranchId={setSelectedBranchId}
          showBranchFilter={isSuperAdmin}
        />
        
        {/* Tabs for different report types */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Company Overview</TabsTrigger>
            <TabsTrigger value="branch" disabled={!isSuperAdmin && !selectedBranchId}>
              {isSuperAdmin ? 'Branch Performance' : 'Branch Details'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <CompanyOverviewReport timeRange={selectedTimeRange} />
          </TabsContent>
          
          <TabsContent value="branch" className="mt-6">
            <BranchPerformanceReport 
              timeRange={selectedTimeRange} 
              branchId={selectedBranchId || (user?.branchId ? parseInt(user.branchId) : 1)}
            />
          </TabsContent>
        </Tabs>
        
        {/* Comparison Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonChart 
              timeRange={selectedTimeRange} 
              branchId={selectedBranchId}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
