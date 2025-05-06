import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LoansList } from '@/components/loans/LoansList';
import { AddLoanDialog } from '@/components/loans/AddLoanDialog';
import { LoanRepaymentDialog } from '@/components/loans/LoanRepaymentDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { getLoans, getLoanRepayments } from '@/api/mock/api';
import { Loan, LoanRepayment } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const LoanManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('pending');
  const [addLoanDialogOpen, setAddLoanDialogOpen] = React.useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);

  const issuperadmin = user?.role === 'superadmin';

  // Fetch loans data
  const { 
    data: loansData, 
    isLoading: isLoadingLoans, 
    isError: isErrorLoans, 
    error: errorLoans 
  } = useQuery<Loan[], Error>({ 
    queryKey: ['loans'], 
    queryFn: async () => {
      const response = await getLoans();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch loans');
    }
  });

  // Fetch loan repayments data
  const { 
    data: repaymentsData, 
    isLoading: isLoadingRepayments, 
    isError: isErrorRepayments, 
    error: errorRepayments 
  } = useQuery<LoanRepayment[], Error>({ 
    queryKey: ['loanRepayments'], 
    queryFn: async () => {
      const response = await getLoanRepayments();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch loan repayments');
    }
  });

  const isLoading = isLoadingLoans || isLoadingRepayments;
  const isError = isErrorLoans || isErrorRepayments;
  const errorMessage = [errorLoans?.message, errorRepayments?.message].filter(Boolean).join('; ') || 'Failed to load loan data.';

  // Calculate loan statistics
  const loanStats = React.useMemo(() => {
    if (!loansData || !repaymentsData) return {
      totalActiveLoans: 0,
      totalLoanAmount: 0,
      totalRepayments: 0,
      pendingApprovals: 0
    };

    const activeLoans = loansData.filter(loan => loan.loan_status === 'Active');
    const totalLoanAmount = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.loan_amount), 0);
    const totalRepayments = repaymentsData.reduce((sum, repayment) => sum + parseFloat(repayment.amount), 0);
    const pendingApprovals = loansData.filter(loan => loan.loan_status === 'Pending').length;

    return {
      totalActiveLoans: activeLoans.length,
      totalLoanAmount,
      totalRepayments,
      pendingApprovals
    };
  }, [loansData, repaymentsData]);

  const handleRepayment = (loan: Loan) => {
    setSelectedLoan(loan);
    setRepaymentDialogOpen(true);
  };

  // Render Loading State
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  // Render Error State
  if (isError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Loan Management</h1>
            <Button onClick={() => setAddLoanDialogOpen(true)}>
              Add New Loan
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Loan Data</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

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
            <LoansList 
              status="pending" 
              canEdit={issuperadmin} 
              onRepayment={handleRepayment}
              loans={loansData?.filter(loan => loan.loan_status === 'Pending') || []}
            />
          </TabsContent>
          <TabsContent value="approved">
            <LoansList 
              status="approved" 
              canEdit={issuperadmin} 
              onRepayment={handleRepayment}
              loans={loansData?.filter(loan => loan.loan_status === 'Active') || []}
            />
          </TabsContent>
          <TabsContent value="rejected">
            <LoansList 
              status="rejected" 
              canEdit={issuperadmin} 
              onRepayment={handleRepayment}
              loans={loansData?.filter(loan => loan.loan_status === 'Rejected') || []}
            />
          </TabsContent>
          <TabsContent value="completed">
            <LoansList 
              status="completed" 
              canEdit={issuperadmin} 
              onRepayment={handleRepayment}
              loans={loansData?.filter(loan => loan.loan_status === 'Paid') || []}
            />
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
