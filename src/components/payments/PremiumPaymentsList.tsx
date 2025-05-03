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
import { EditPaymentDialog } from './EditPaymentDialog';

// Define interface based on data.json premium_payments
interface PremiumPayment {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  annual_premium: string;
  interval_payment: string;
  total_paid: string;
  paid_amount: string;
  next_payment_date: string;
  fine_due: string;
  total_premium: string;
  remaining_premium: string;
  gsv_value: string;
  ssv_value: string;
  payment_status: string;
  policy_holder: number;
}

interface PremiumPaymentsListProps {
  canEdit: boolean;
  filter?: string;
  searchTerm?: string;
}

export const PremiumPaymentsList = ({ canEdit, filter = 'all', searchTerm = '' }: PremiumPaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = React.useState<PremiumPayment | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  
  // Mock data based on data.json
  const allPremiumPayments: PremiumPayment[] = [
    {
      id: 3,
      policy_holder_number: "1751451440001",
      customer_name: "Nur Pratap Karki",
      annual_premium: "115625.00",
      interval_payment: "115625.00",
      total_paid: "115625.00",
      paid_amount: "0.00",
      next_payment_date: "2027-04-29",
      fine_due: "0.00",
      total_premium: "1156250.00",
      remaining_premium: "1040625.00",
      gsv_value: "0.00",
      ssv_value: "0.00",
      payment_status: "Partially Paid",
      policy_holder: 1
    },
    {
      id: 4,
      policy_holder_number: "1751451440002",
      customer_name: "Sumitra Bam",
      annual_premium: "23125.00",
      interval_payment: "23125.00",
      total_paid: "115625.00",
      paid_amount: "0.00",
      next_payment_date: "2026-04-30",
      fine_due: "0.00",
      total_premium: "231250.00",
      remaining_premium: "115625.00",
      gsv_value: "32375.00",
      ssv_value: "0.00",
      payment_status: "Partially Paid",
      policy_holder: 2
    },
    // Add a paid payment for demonstration
    {
      id: 5,
      policy_holder_number: "1751451440003",
      customer_name: "Sankalp Tharu",
      annual_premium: "50000.00",
      interval_payment: "50000.00",
      total_paid: "50000.00",
      paid_amount: "0.00",
      next_payment_date: "2026-05-15",
      fine_due: "0.00",
      total_premium: "50000.00",
      remaining_premium: "0.00",
      gsv_value: "0.00",
      ssv_value: "0.00",
      payment_status: "Paid",
      policy_holder: 3
    }
  ];
  
  // Filter premium payments based on status and search term
  const filteredPayments = allPremiumPayments
    .filter(payment => {
      if (filter === 'all') return true;
      return payment.payment_status === filter;
    })
    .filter(payment => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.policy_holder_number.toLowerCase().includes(searchLower) ||
        payment.customer_name.toLowerCase().includes(searchLower)
      );
    });
  
  const handleViewPayment = (payment: PremiumPayment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };
  
  const handleEditPayment = (payment: PremiumPayment) => {
    setSelectedPayment(payment);
    setEditOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return { variant: "outline", className: "bg-green-100 text-green-800 hover:bg-green-200" };
      case 'Partially Paid':
        return { variant: "secondary", className: "" };
      case 'Unpaid':
      case 'Pending':
        return { variant: "default", className: "" };
      default:
        return { variant: "default", className: "" };
    }
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Number</TableHead>
                <TableHead>Policy Holder</TableHead>
                <TableHead>Annual Premium</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No payments found matching the filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const statusStyle = getStatusColor(payment.payment_status);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.policy_holder_number}</TableCell>
                      <TableCell>{payment.customer_name}</TableCell>
                      <TableCell>{formatCurrency(parseFloat(payment.annual_premium))}</TableCell>
                      <TableCell>{formatCurrency(parseFloat(payment.total_paid))}</TableCell>
                      <TableCell>{formatCurrency(parseFloat(payment.remaining_premium))}</TableCell>
                      <TableCell>{formatDate(payment.next_payment_date)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusStyle.variant as any}
                          className={statusStyle.className}
                        >
                          {payment.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {canEdit && payment.payment_status !== 'Paid' && (
                            <Button variant="ghost" size="sm" onClick={() => handleEditPayment(payment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedPayment && (
        <>
          <PaymentDetailsDialog
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            payment={selectedPayment}
            canEdit={canEdit}
            type="premium"
          />
          
          <EditPaymentDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            payment={selectedPayment}
          />
        </>
      )}
    </>
  );
};
