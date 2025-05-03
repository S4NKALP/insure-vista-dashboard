import React from 'react';
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
import { Plus } from 'lucide-react';
import { AddLoanDialog } from './AddLoanDialog';
import appData from '@/api/mock/data';

// Calculate loan statistics from mock data
const calculateLoanStatistics = () => {
  const { loans, loan_repayments } = appData;
  
  // Total active loans
  const activeLoans = loans.filter(loan => loan.loan_status === 'Active');
  const totalActiveLoansAmount = activeLoans.reduce((total, loan) => {
    return total + parseFloat(loan.loan_amount);
  }, 0);
  
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Repayments this month
  const repaymentsThisMonth = loan_repayments.filter(repayment => {
    const repaymentDate = new Date(repayment.repayment_date);
    return repaymentDate.getMonth() === currentMonth && 
           repaymentDate.getFullYear() === currentYear;
  });
  
  const totalRepaymentsThisMonth = repaymentsThisMonth.reduce((total, repayment) => {
    return total + parseFloat(repayment.amount);
  }, 0);
  
  // Pending loans
  const pendingLoans = loans.filter(loan => loan.loan_status === 'Pending');
  
  // Generate monthly loan data (using the creation date)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyLoanMap = new Map();
  
  // Initialize with all months
  monthNames.forEach(month => {
    monthlyLoanMap.set(month, 0);
  });
  
  // Aggregate loan amounts by month
  loans.forEach(loan => {
    const creationDate = new Date(loan.created_at);
    const monthName = monthNames[creationDate.getMonth()];
    const currentAmount = monthlyLoanMap.get(monthName) || 0;
    monthlyLoanMap.set(monthName, currentAmount + parseFloat(loan.loan_amount));
  });
  
  const monthlyLoanData = Array.from(monthlyLoanMap).map(([name, amount]) => ({
    name,
    amount
  }));
  
  // We don't have type data, but we'll generate some based on loan amount ranges
  // This is just for visualization purposes since the actual data doesn't include types
  const loanTypeData = [
    { name: 'Policy Loans', value: totalActiveLoansAmount },
    { name: 'Mortgage Loans', value: 0 },
    { name: 'Personal Loans', value: 0 }
  ];
  
  // Status distribution
  const statusDistribution = new Map();
  loans.forEach(loan => {
    const status = loan.loan_status;
    const count = statusDistribution.get(status) || 0;
    statusDistribution.set(status, count + 1);
  });
  
  // Ensure we have all statuses represented
  ['Active', 'Pending', 'Completed', 'Rejected'].forEach(status => {
    if (!statusDistribution.has(status)) {
      statusDistribution.set(status, 0);
    }
  });
  
  const loanStatusData = Array.from(statusDistribution).map(([name, value]) => ({
    name,
    value
  }));
  
  return {
    totalActiveLoansAmount,
    totalRepaymentsThisMonth,
    pendingLoans: pendingLoans.length,
    monthlyLoanData,
    loanTypeData,
    loanStatusData
  };
};

export const LoansDashboard = () => {
  const { user } = useAuth();
  const isBranch = user?.role === 'branch';
  const [addLoanOpen, setAddLoanOpen] = React.useState(false);
  
  // Get loan statistics from mock data
  const {
    totalActiveLoansAmount,
    totalRepaymentsThisMonth,
    pendingLoans,
    monthlyLoanData,
    loanTypeData,
    loanStatusData
  } = calculateLoanStatistics();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            <div className="text-2xl font-bold">{formatCurrency(totalActiveLoansAmount)}</div>
            <div className="text-xs text-muted-foreground">
              Based on {appData.loans.filter(l => l.loan_status === 'Active').length} active loans
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repayments This Month</CardTitle>
            <CardDescription>Total loan repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRepaymentsThisMonth)}</div>
            <div className="text-xs text-muted-foreground">
              From {appData.loan_repayments.length} repayment entries
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Loans awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLoans}</div>
            <div className="text-xs text-muted-foreground">
              Out of {appData.loans.length} total loans
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
              <BarChart data={monthlyLoanData}>
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
                      data={loanTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {loanTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">By Status</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={loanStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {loanStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddLoanDialog open={addLoanOpen} onOpenChange={setAddLoanOpen} />
    </div>
  );
};
