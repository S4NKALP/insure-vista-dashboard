import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LoanDetailsDialog } from './LoanDetailsDialog';
import { AddRepaymentDialog } from './AddRepaymentDialog';
import { Eye, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loan } from '@/types';

interface LoansListProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  canEdit: boolean;
  onRepayment?: (loan: Loan) => void;
  loans: Loan[];
}

export const LoansList: React.FC<LoansListProps> = ({ status, canEdit, onRepayment, loans }) => {
  const { user } = useAuth();
  const userBranch = user?.branchName || '';

  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = React.useState(false);

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailsDialogOpen(true);
  };

  const handleAddRepayment = (loan: Loan) => {
    setSelectedLoan(loan);
    setRepaymentDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100">Active</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100">Rejected</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No loans found in this category
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Loan Amount</TableHead>
            <TableHead>Remaining Balance</TableHead>
            <TableHead>Accrued Interest</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Last Interest Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.policy_holder_number}</TableCell>
              <TableCell>{loan.customer_name}</TableCell>
              <TableCell>{formatCurrency(parseFloat(loan.loan_amount))}</TableCell>
              <TableCell>{formatCurrency(parseFloat(loan.remaining_balance))}</TableCell>
              <TableCell>{formatCurrency(parseFloat(loan.accrued_interest))}</TableCell>
              <TableCell>{loan.interest_rate}%</TableCell>
              <TableCell>{loan.last_interest_date}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(loan.loan_status)}>
                  {loan.loan_status}
                </Badge>
              </TableCell>
              <TableCell>{loan.created_at}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(loan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {canEdit && loan.loan_status === 'Active' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRepayment?.(loan)}
                          >
                            Record Payment
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Record Loan Payment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {selectedLoan && (
        <>
          <LoanDetailsDialog 
            loan={selectedLoan} 
            open={detailsDialogOpen} 
            onOpenChange={setDetailsDialogOpen} 
            canEdit={canEdit} 
          />
          
          <AddRepaymentDialog 
            loan={selectedLoan}
            open={repaymentDialogOpen}
            onOpenChange={setRepaymentDialogOpen}
            canEdit={canEdit}
          />
        </>
      )}
    </div>
  );
};
