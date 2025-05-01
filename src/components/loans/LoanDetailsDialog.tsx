
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface LoanDetailsDialogProps {
  loan: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}

export const LoanDetailsDialog: React.FC<LoanDetailsDialogProps> = ({
  loan,
  open,
  onOpenChange,
  canEdit
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Loan Details - {loan.id}</span>
            {getStatusBadge(loan.status)}
          </DialogTitle>
          <DialogDescription>
            Information about loan {loan.id} for {loan.policyHolder}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy Holder:</span>
                <span className="font-medium">{loan.policyHolder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy ID:</span>
                <span className="font-medium">{loan.policyId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Type:</span>
                <span className="font-medium">{loan.loanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formatCurrency(loan.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-medium">{loan.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-medium">{loan.branch}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Status Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request Date:</span>
                <span className="font-medium">{format(new Date(loan.requestDate), 'dd MMM yyyy')}</span>
              </div>
              {loan.approvalDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approval Date:</span>
                  <span className="font-medium">{format(new Date(loan.approvalDate), 'dd MMM yyyy')}</span>
                </div>
              )}
              {loan.rejectionDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejection Date:</span>
                  <span className="font-medium">{format(new Date(loan.rejectionDate), 'dd MMM yyyy')}</span>
                </div>
              )}
              {loan.completionDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-medium">{format(new Date(loan.completionDate), 'dd MMM yyyy')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason:</span>
                <span className="font-medium">{loan.reason}</span>
              </div>
              {loan.rejectionReason && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejection Reason:</span>
                  <span className="font-medium text-red-600">{loan.rejectionReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {(loan.status === 'approved' || loan.status === 'completed') && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Repayment Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Amount:</span>
                  <span className="font-medium">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Due:</span>
                  <span className="font-medium">{formatCurrency(loan.amountDue || loan.amount)}</span>
                </div>
              </div>
              
              {loan.repayments && loan.repayments.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-xs font-medium mb-2">Repayment History</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loan.repayments.map((repayment: any) => (
                        <tr key={repayment.id} className="border-b">
                          <td className="py-2">{format(new Date(repayment.date), 'dd MMM yyyy')}</td>
                          <td className="py-2 text-right">{formatCurrency(repayment.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-4 text-center text-muted-foreground text-sm">
                  No repayments recorded yet
                </div>
              )}
            </div>
          </>
        )}
        
        <DialogFooter>
          {loan.status === 'pending' && canEdit && (
            <>
              <Button variant="outline" className="bg-green-100 hover:bg-green-200 text-green-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button variant="outline" className="bg-red-100 hover:bg-red-200 text-red-700">
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
