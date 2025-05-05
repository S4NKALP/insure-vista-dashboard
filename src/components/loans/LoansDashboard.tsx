import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { AddLoanDialog } from './AddLoanDialog';
import { getLoans, getLoanRepayments } from '@/api/endpoints';
import { Loan, LoanRepayment } from '@/types'; // Assuming these types exist
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Fetching Functions ---
const fetchLoans = async (): Promise<Loan[]> => {
  const response = await getLoans();
  if (response.success && response.data) {
    return response.data as Loan[];
  } else {
    throw new Error(response.message || 'Failed to fetch loans');
  }
};

const fetchRepayments = async (): Promise<LoanRepayment[]> => {
  const response = await getLoanRepayments();
  if (response.success && response.data) {
    return response.data as LoanRepayment[];
  } else {
    throw new Error(response.message || 'Failed to fetch loan repayments');
  }
};

// --- Helper Functions ---
const calculateLoanStatistics = (loans: Loan[] = [], repayments: LoanRepayment[] = []) => {
  const activeLoans = loans.filter(loan => loan.loan_status === 'Active');
  const totalActiveLoansAmount = activeLoans.reduce((total, loan) => total + parseFloat(loan.loan_amount || '0'), 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const repaymentsThisMonth = repayments.filter(repayment => {
    const repaymentDate = new Date(repayment.repayment_date);
    return repaymentDate.getMonth() === currentMonth && repaymentDate.getFullYear() === currentYear;
  });
  const totalRepaymentsThisMonth = repaymentsThisMonth.reduce((total, repayment) => total + parseFloat(repayment.amount || '0'), 0);

  const pendingLoansCount = loans.filter(loan => loan.loan_status === 'Pending').length;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyLoanMap = new Map<string, number>();
  monthNames.forEach(month => monthlyLoanMap.set(month, 0));
  loans.forEach(loan => {
    try {
      const creationDate = new Date(loan.created_at);
      if (!isNaN(creationDate.getTime())) {
        const monthName = monthNames[creationDate.getMonth()];
        const currentAmount = monthlyLoanMap.get(monthName) || 0;
        monthlyLoanMap.set(monthName, currentAmount + parseFloat(loan.loan_amount || '0'));
      }
    } catch (e) { console.error("Error parsing loan date:", loan.created_at); }
  });
  const monthlyLoanData = Array.from(monthlyLoanMap).map(([name, amount]) => ({ name, amount }));

  // Placeholder - needs real data or logic for loan types
  const loanTypeData = [
    { name: 'Policy Loans', value: totalActiveLoansAmount > 0 ? totalActiveLoansAmount : 0 },
    { name: 'Mortgage Loans', value: 0 }, 
    { name: 'Personal Loans', value: 0 }
  ].filter(d => d.value > 0); // Only show types with value
  if (loanTypeData.length === 0 && loans.length > 0) {
    loanTypeData.push({ name: 'Unknown Type', value: totalActiveLoansAmount });
  } else if (loanTypeData.length === 0 && loans.length === 0) {
     loanTypeData.push({ name: 'No Data', value: 1 }); // Placeholder for empty chart
  }

  const statusDistribution = new Map<string, number>();
  ['Active', 'Pending', 'Completed', 'Rejected'].forEach(status => statusDistribution.set(status, 0)); // Initialize all statuses
  loans.forEach(loan => {
    const status = loan.loan_status || 'Unknown';
    const count = statusDistribution.get(status) || 0;
    statusDistribution.set(status, count + 1);
  });
  const loanStatusData = Array.from(statusDistribution).map(([name, value]) => ({ name, value }));
  if(loans.length === 0) loanStatusData.push({ name: 'No Data', value: 1 });

  return {
    totalActiveLoans: activeLoans.length,
    totalActiveLoansAmount,
    totalRepaymentsThisMonth,
    totalRepaymentEntries: repayments.length,
    pendingLoans: pendingLoansCount,
    totalLoans: loans.length,
    monthlyLoanData,
    loanTypeData,
    loanStatusData
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// --- Component ---
export const LoansDashboard = () => {
  const { user } = useAuth();
  const isBranch = user?.role === 'branch';
  const [addLoanOpen, setAddLoanOpen] = React.useState(false);

  const { 
    data: loansData, 
    isLoading: isLoadingLoans, 
    isError: isErrorLoans, 
    error: errorLoans 
  } = useQuery<Loan[], Error>({ queryKey: ['loans'], queryFn: fetchLoans, staleTime: 5 * 60 * 1000 });

  const { 
    data: repaymentsData, 
    isLoading: isLoadingRepayments, 
    isError: isErrorRepayments, 
    error: errorRepayments 
  } = useQuery<LoanRepayment[], Error>({ queryKey: ['loanRepayments'], queryFn: fetchRepayments, staleTime: 5 * 60 * 1000 });

  const isLoading = isLoadingLoans || isLoadingRepayments;
  const isError = isErrorLoans || isErrorRepayments;
  const errorMessage = [errorLoans?.message, errorRepayments?.message].filter(Boolean).join('; ') || 'Failed to load loan data.';

  // Calculate stats only when data is available
  const stats = React.useMemo(() => 
    calculateLoanStatistics(loansData, repaymentsData), 
    [loansData, repaymentsData]
  );

  // Render Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          {isBranch && <Skeleton className="h-10 w-36" />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        {isBranch && <AddLoanDialog open={addLoanOpen} onOpenChange={setAddLoanOpen} />} 
      </div>
    );
  }

  // Render Error State
  if (isError) {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Loan Management</h1>
          {isBranch && (
            <Button onClick={() => setAddLoanOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Apply for Loan
            </Button>
          )}
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Loan Data</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        {isBranch && <AddLoanDialog open={addLoanOpen} onOpenChange={setAddLoanOpen} />}
      </div>
    );
  }

  // Render Content
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loan Management</h1>
        {isBranch && (
          <Button onClick={() => setAddLoanOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Active Loans</CardTitle>
            <CardDescription>Current outstanding loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalActiveLoansAmount)}</div>
            <div className="text-xs text-muted-foreground">
              Based on {stats.totalActiveLoans} active loans
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repayments This Month</CardTitle>
            <CardDescription>Total loan repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRepaymentsThisMonth)}</div>
            <div className="text-xs text-muted-foreground">
              From {stats.totalRepaymentEntries} repayment entries
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Loans awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLoans}</div>
            <div className="text-xs text-muted-foreground">
              Out of {stats.totalLoans} total loans
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Loan Disbursement</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyLoanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
              <div>
                <h4 className="text-sm font-medium mb-4">By Loan Type</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={stats.loanTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60} // Reduced size slightly
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        name !== 'No Data' && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {stats.loanTypeData.map((entry, index) => (
                        <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    {stats.loanTypeData[0]?.name !== 'No Data' && <Tooltip formatter={(value) => formatCurrency(Number(value))} />}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">By Status</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={stats.loanStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60} // Reduced size slightly
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        name !== 'No Data' && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {stats.loanStatusData.map((entry, index) => (
                        <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                     {stats.loanStatusData[0]?.name !== 'No Data' && <Tooltip formatter={(value) => `${value} loans`} />}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Loan Dialog for Branch Users */}
      {isBranch && <AddLoanDialog open={addLoanOpen} onOpenChange={setAddLoanOpen} />} 
    </div>
  );
};
