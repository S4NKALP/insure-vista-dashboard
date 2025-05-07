import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getLoanById, getLoanRepayments } from '@/api/mock/api';
import { Loan } from '@/types';

interface LoanDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
  canEdit: boolean;
}

export const LoanDetailsDialog: React.FC<LoanDetailsDialogProps> = ({ 
  open, 
  onOpenChange,
  loan,
  canEdit
}) => {
  const { data: repaymentsData, isLoading: isLoadingRepayments } = useQuery({
    queryKey: ['loanRepayments', loan.id],
    queryFn: async () => {
      const response = await getLoanRepayments();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch loan repayments');
      }
      // Filter repayments for this specific loan
      return response.data.filter((repayment: any) => repayment.loan_id === loan.id);
    },
    enabled: open,
  });

  if (isLoadingRepayments) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Loan Details</DialogTitle>
          <DialogDescription>
            View detailed information about loan #{loan.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Policy Holder Number</dt>
                    <dd className="font-medium">{loan.policy_holder_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Customer Name</dt>
                    <dd className="font-medium">{loan.customer_name}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Loan Status</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd>
                      <Badge className={getStatusColor(loan.loan_status)}>
                        {loan.loan_status}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Created Date</dt>
                    <dd className="font-medium">{loan.created_at}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Original Amount</dt>
                  <dd className="text-lg font-semibold">
                    {formatCurrency(parseFloat(loan.loan_amount))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Remaining Balance</dt>
                  <dd className="text-lg font-semibold">
                    {formatCurrency(parseFloat(loan.remaining_balance))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Interest Rate</dt>
                  <dd className="text-lg font-semibold">{loan.interest_rate}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Accrued Interest</dt>
                  <dd className="text-lg font-semibold text-amber-600">
                    {formatCurrency(parseFloat(loan.accrued_interest))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Last Interest Date</dt>
                  <dd className="font-medium">{loan.last_interest_date}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">{loan.updated_at}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Repayment History</CardTitle>
            </CardHeader>
            <CardContent>
              {repaymentsData && repaymentsData.length > 0 ? (
                <div className="space-y-4">
                  {repaymentsData.map((repayment: any) => (
                    <div 
                      key={repayment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(repayment.amount))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {repayment.repayment_date} - {repayment.repayment_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Remaining Balance</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(repayment.remaining_loan_balance))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No repayment history available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
