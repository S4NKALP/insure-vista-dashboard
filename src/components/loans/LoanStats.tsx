import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface LoanStatsProps {
  totalActiveLoans: number;
  totalLoanAmount: number;
  totalRepayments: number;
  pendingApprovals: number;
}

export const LoanStats: React.FC<LoanStatsProps> = ({
  totalActiveLoans,
  totalLoanAmount,
  totalRepayments,
  pendingApprovals,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActiveLoans}</div>
          <p className="text-xs text-muted-foreground">
            Currently active loan accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</div>
          <p className="text-xs text-muted-foreground">
            Total amount disbursed in loans
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Repayments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRepayments)}</div>
          <p className="text-xs text-muted-foreground">
            Total amount repaid by borrowers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApprovals}</div>
          <p className="text-xs text-muted-foreground">
            Loan applications awaiting approval
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 