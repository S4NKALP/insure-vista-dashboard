
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

interface PremiumPaymentsListProps {
  canEdit: boolean;
}

// Mock premium payments data
const mockPremiumPayments = [
  {
    id: '1',
    policyNumber: '17514514140001',
    customerName: 'Vijay Sharma',
    amount: 15000,
    dueDate: '2024-04-05',
    paidDate: '2024-04-03',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP-2024-001'
  },
  {
    id: '2',
    policyNumber: '17514514140002',
    customerName: 'Amit Thapa',
    amount: 25000,
    dueDate: '2024-04-10',
    paidDate: null,
    status: 'Pending',
    paymentMethod: null,
    receiptNumber: null
  },
  {
    id: '3',
    policyNumber: '17514514140003',
    customerName: 'Sunita Gurung',
    amount: 18500,
    dueDate: '2024-03-25',
    paidDate: '2024-03-22',
    status: 'Paid',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-2024-102'
  },
  {
    id: '4',
    policyNumber: '17514514140001',
    customerName: 'Vijay Sharma',
    amount: 15000,
    dueDate: '2024-03-05',
    paidDate: '2024-03-07',
    status: 'Late',
    paymentMethod: 'Online',
    receiptNumber: 'RCP-2024-089'
  },
];

export const PremiumPaymentsList = ({ canEdit }: PremiumPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  
  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };
  
  const handleMarkPaid = (payment: any) => {
    toast({
      title: "Payment marked as paid",
      description: `Payment for policy ${payment.policyNumber} has been marked as paid`,
    });
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Policy Number</TableHead>
                <TableHead>Policy Holder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPremiumPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.receiptNumber || '-'}</TableCell>
                  <TableCell>{payment.policyNumber}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.dueDate)}</TableCell>
                  <TableCell>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === 'Paid' ? "outline" : 
                        payment.status === 'Pending' ? "default" : 
                        "secondary"
                      }
                      className={payment.status === 'Paid' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
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
                        <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(payment)}>
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
          type="premium"
        />
      )}
    </>
  );
};
