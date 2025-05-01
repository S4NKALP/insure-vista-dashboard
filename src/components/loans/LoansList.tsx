
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Mock data for loans
const mockedLoans = {
  pending: [
    {
      id: 'loan-001',
      policyHolder: 'Ram Sharma',
      policyHolderId: 'ph-001',
      policyId: 'pol-term-001',
      loanType: 'Policy Loan',
      amount: 150000,
      requestDate: '2024-04-15',
      reason: 'Children Education',
      branch: 'Kohalpur Branch',
      interestRate: 9.5,
      status: 'pending'
    },
    {
      id: 'loan-002',
      policyHolder: 'Sita Poudel',
      policyHolderId: 'ph-002',
      policyId: 'pol-end-003',
      loanType: 'Policy Loan',
      amount: 250000,
      requestDate: '2024-04-18',
      reason: 'Medical Expenses',
      branch: 'Kohalpur Branch',
      interestRate: 10,
      status: 'pending'
    }
  ],
  approved: [
    {
      id: 'loan-003',
      policyHolder: 'Hari Thapa',
      policyHolderId: 'ph-003',
      policyId: 'pol-end-005',
      loanType: 'Policy Loan',
      amount: 350000,
      requestDate: '2024-04-01',
      approvalDate: '2024-04-05',
      reason: 'Business Investment',
      branch: 'Pokhara Branch',
      interestRate: 9.5,
      status: 'approved',
      amountDue: 350000,
      repayments: []
    }
  ],
  rejected: [
    {
      id: 'loan-004',
      policyHolder: 'Gita Karki',
      policyHolderId: 'ph-004',
      policyId: 'pol-term-008',
      loanType: 'Policy Loan',
      amount: 500000,
      requestDate: '2024-04-12',
      rejectionDate: '2024-04-16',
      reason: 'Home Renovation',
      rejectionReason: 'Insufficient policy value',
      branch: 'Kathmandu Branch',
      interestRate: 10,
      status: 'rejected'
    }
  ],
  completed: [
    {
      id: 'loan-005',
      policyHolder: 'Mohan Shrestha',
      policyHolderId: 'ph-005',
      policyId: 'pol-end-010',
      loanType: 'Policy Loan',
      amount: 200000,
      requestDate: '2024-03-01',
      approvalDate: '2024-03-05',
      completionDate: '2024-04-10',
      reason: 'Debt Consolidation',
      branch: 'Kathmandu Branch',
      interestRate: 9.5,
      status: 'completed',
      amountDue: 0,
      repayments: [
        { id: 'rep-001', date: '2024-03-20', amount: 100000 },
        { id: 'rep-002', date: '2024-04-10', amount: 110000 }
      ]
    }
  ]
};

interface LoansListProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  canEdit: boolean;
}

export const LoansList: React.FC<LoansListProps> = ({ status, canEdit }) => {
  const { user } = useAuth();
  const userBranch = user?.branchName || '';

  const [selectedLoan, setSelectedLoan] = React.useState<any | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = React.useState(false);

  // If branch user, filter loans by their branch
  let loans = mockedLoans[status] || [];
  if (user?.role === 'branch') {
    loans = loans.filter(loan => loan.branch === userBranch);
  }

  const handleViewDetails = (loan: any) => {
    setSelectedLoan(loan);
    setDetailsDialogOpen(true);
  };

  const handleAddRepayment = (loan: any) => {
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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan ID</TableHead>
            <TableHead>Policy Holder</TableHead>
            <TableHead>Loan Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.id}</TableCell>
                <TableCell>{loan.policyHolder}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>{formatCurrency(loan.amount)}</TableCell>
                <TableCell>{loan.branch}</TableCell>
                <TableCell>{formatDate(status === 'rejected' ? loan.rejectionDate : 
                  status === 'completed' ? loan.completionDate : 
                  status === 'approved' ? loan.approvalDate : loan.requestDate)}</TableCell>
                <TableCell>{getStatusBadge(loan.status)}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(loan)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {status === 'approved' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user?.role === 'branch' && (
                          <DropdownMenuItem onClick={() => handleAddRepayment(loan)}>
                            Add Repayment
                          </DropdownMenuItem>
                        )}
                        {canEdit && (
                          <>
                            <DropdownMenuItem onClick={() => handleAddRepayment(loan)}>
                              Add Repayment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Mark as Complete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No loans found
              </TableCell>
            </TableRow>
          )}
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
