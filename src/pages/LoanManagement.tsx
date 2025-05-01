
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { LoansList } from '@/components/loans/LoansList';
import { LoansDashboard } from '@/components/loans/LoansDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoanManagement = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  
  return (
    <DashboardLayout title="Loan Management">
      <div className="space-y-6">
        <LoansDashboard />
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Loans</TabsTrigger>
            <TabsTrigger value="approved">Approved Loans</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Loans</TabsTrigger>
            <TabsTrigger value="completed">Completed Loans</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <LoansList status="pending" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="approved">
            <LoansList status="approved" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="rejected">
            <LoansList status="rejected" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="completed">
            <LoansList status="completed" canEdit={isSuperAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LoanManagement;
