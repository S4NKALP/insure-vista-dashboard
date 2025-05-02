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

interface Loan {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  loan_amount: string;
  remaining_balance: string;
  interest_rate: string;
  loan_status: string;
  created_at: string;
  updated_at: string;
  accrued_interest: string;
  last_interest_date: string;
  policy_holder: number;
}

interface LoansListProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  canEdit: boolean;
  onRepayment?: (loan: Loan) => void;
}

export const LoansList: React.FC<LoansListProps> = ({ status, canEdit, onRepayment }) => {
  const { user } = useAuth();
  const userBranch = user?.branchName || '';

  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = React.useState(false);

  // Mock data based on data.json format
  const loans: Loan[] = [
    {
      id: 1,
      policy_holder_number: "1751451440002",
      customer_name: "Sumitra Bam",
      loan_amount: "25000.00",
      remaining_balance: "13000.00",
      interest_rate: "7.00",
      loan_status: "Active",
      created_at: "2025-04-30",
      updated_at: "2025-04-30",
      accrued_interest: "0.00",
      last_interest_date: "2025-04-30",
      policy_holder: 2
    }
  ];

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailsDialogOpen(true);
  };

  const handleAddRepayment = (loan: Loan) => {
    setSelectedLoan(loan);
    setRepaymentDialogOpen(true);
  };

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

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
                {canEdit && loan.loan_status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRepayment?.(loan)}
                  >
                    Record Payment
                  </Button>
                )}
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
