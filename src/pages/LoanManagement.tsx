import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LoansList } from '@/components/loans/LoansList';
import { AddLoanDialog } from '@/components/loans/AddLoanDialog';
import { LoanRepaymentDialog } from '@/components/loans/LoanRepaymentDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

const LoanManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('pending');
  const [addLoanDialogOpen, setAddLoanDialogOpen] = React.useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState<any>(null);

  const issuperadmin = user?.role === 'superadmin';

  // In a real app, this would come from an API
  const loanStats = {
    totalActiveLoans: 15,
    totalLoanAmount: 2500000,
    totalRepayments: 750000,
    pendingApprovals: 3
  };

  const handleRepayment = (loan: any) => {
    setSelectedLoan(loan);
    setRepaymentDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Loan Management</h1>
          <Button onClick={() => setAddLoanDialogOpen(true)}>
            Add New Loan
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loanStats.totalActiveLoans}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(loanStats.totalLoanAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Repayments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(loanStats.totalRepayments)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loanStats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <LoansList status="pending" canEdit={issuperadmin} onRepayment={handleRepayment} />
          </TabsContent>
          <TabsContent value="approved">
            <LoansList status="approved" canEdit={issuperadmin} onRepayment={handleRepayment} />
          </TabsContent>
          <TabsContent value="rejected">
            <LoansList status="rejected" canEdit={issuperadmin} onRepayment={handleRepayment} />
          </TabsContent>
          <TabsContent value="completed">
            <LoansList status="completed" canEdit={issuperadmin} onRepayment={handleRepayment} />
          </TabsContent>
        </Tabs>
      </div>

      <AddLoanDialog
        open={addLoanDialogOpen}
        onOpenChange={setAddLoanDialogOpen}
      />

      {selectedLoan && (
        <LoanRepaymentDialog
          open={repaymentDialogOpen}
          onOpenChange={setRepaymentDialogOpen}
          loan={selectedLoan}
        />
      )}
    </DashboardLayout>
  );
};

export default LoanManagement;
