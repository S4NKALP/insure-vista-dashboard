
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from '@/lib/utils';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';

interface ClaimPaymentsListProps {
  canEdit: boolean;
}

// Mock claim payments data
const mockClaimPayments = [
  {
    id: '1',
    claimId: '2',
    policyNumber: '17514514140001',
    customerName: 'Nur Pratap Karki',
    amount: 5000000,
    approvedDate: '2024-04-01',
    paymentDate: '2024-04-15',
    status: 'Processed',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-2024-001',
    beneficiary: 'Rita Karki (Spouse)',
    beneficiaryAccount: 'XXXX-XXXX-7890'
  },
  {
    id: '2',
    claimId: '3',
    policyNumber: '17514514140003',
    customerName: 'Sunita Gurung',
    amount: 250000,
    approvedDate: '2024-04-05',
    paymentDate: null,
    status: 'Pending',
    paymentMethod: null,
    transactionId: null,
    beneficiary: 'Sunita Gurung (Self)',
    beneficiaryAccount: 'XXXX-XXXX-1234'
  },
  {
    id: '3',
    claimId: '4',
    policyNumber: '17514514140002',
    customerName: 'Amit Thapa',
    amount: 175000,
    approvedDate: '2024-03-20',
    paymentDate: '2024-03-25',
    status: 'Processed',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-2024-089',
    beneficiary: 'Amit Thapa (Self)',
    beneficiaryAccount: 'XXXX-XXXX-5678'
  }
];

export const ClaimPaymentsList = ({ canEdit }: ClaimPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  
  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };
  
  const handleProcessPayment = (payment: any) => {
    toast({
      title: "Payment processed",
      description: `Payment for claim ${payment.claimId} has been processed`,
    });
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Policy Holder</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Approved Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClaimPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.transactionId || '-'}</TableCell>
                  <TableCell>{payment.claimId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.beneficiary}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.approvedDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === 'Processed' ? "outline" : 
                        payment.status === 'Pending' ? "default" : 
                        "secondary"
                      }
                      className={payment.status === 'Processed' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {canEdit && payment.status === 'Pending' && (
                        <Button variant="ghost" size="sm" onClick={() => handleProcessPayment(payment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedPayment && (
        <PaymentDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          payment={selectedPayment}
          canEdit={canEdit}
          type="claim"
        />
      )}
    </>
  );
};
