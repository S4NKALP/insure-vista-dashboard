import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
  canEdit: boolean;
  type: 'premium' | 'claim';
}

export const PaymentDetailsDialog = ({ 
  open, 
  onOpenChange, 
  payment, 
  canEdit,
  type
}: PaymentDetailsDialogProps) => {
  const { toast } = useToast();
  
  // Initialize form values
  const form = useForm({
    defaultValues: {
      paymentMethod: payment.paymentMethod || '',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: payment.transactionId || '',
      notes: '',
    }
  });
  
  // Determine which properties to use for premium payments vs claim payments
  const policyNumber = type === 'premium' ? payment.policy_holder_number : payment.policyNumber;
  const customerName = type === 'premium' ? payment.customer_name : payment.customerName;
  const status = type === 'premium' ? payment.payment_status : payment.status;
  
  // For premium payments, adapt the data structure to what the dialog needs
  const amount = type === 'premium' 
    ? (payment.annual_premium || payment.interval_payment || payment.total_paid || 0) 
    : payment.amount;
  
  const handleProcessPayment = (data: any) => {
    toast({
      title: "Payment processed",
      description: type === 'premium' 
        ? `Premium payment for policy ${policyNumber} has been recorded` 
        : `Claim payment for claim ${payment.claimId} has been processed`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'premium' ? 'Premium Payment Details' : 'Claim Payment Details'}
          </DialogTitle>
          <DialogDescription>
            {type === 'premium' 
              ? `Policy: ${policyNumber}`
              : `Claim: ${payment.claimId} | Policy: ${policyNumber}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Policy Holder</h3>
            <p className="text-base">{customerName}</p>
          </div>
          
          {type === 'premium' ? (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Annual Premium</h3>
                <p className="text-base font-semibold">{formatCurrency(payment.annual_premium)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Paid</h3>
                <p className="text-base">{formatCurrency(payment.total_paid)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remaining Premium</h3>
                <p className="text-base">{formatCurrency(payment.remaining_premium)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Next Payment Date</h3>
                <p className="text-base">{formatDate(payment.next_payment_date)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge 
                  variant={
                    status === 'Paid' ? "outline" : 
                    status === 'Partially Paid' ? "secondary" : 
                    "default"
                  }
                  className={status === 'Paid' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {status}
                </Badge>
              </div>
              
              {payment.fine_due && parseFloat(payment.fine_due) > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fine Due</h3>
                  <p className="text-base">{formatCurrency(payment.fine_due)}</p>
                </div>
              )}
              
              {payment.gsv_value && parseFloat(payment.gsv_value) > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">GSV Value</h3>
                  <p className="text-base">{formatCurrency(payment.gsv_value)}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                <p className="text-base font-semibold">{formatCurrency(amount)}</p>
              </div>
            
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Beneficiary</h3>
                <p className="text-base">{payment.beneficiary}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge 
                  variant={
                    status === 'Processed' ? "outline" : 
                    status === 'Pending' ? "default" : 
                    "secondary"
                  }
                  className={status === 'Processed' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {status}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Beneficiary Account</h3>
                <p className="text-base">{payment.beneficiaryAccount}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Approved Date</h3>
                <p className="text-base">{formatDate(payment.approvedDate)}</p>
              </div>
              
              {payment.paymentDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                  <p className="text-base">{formatDate(payment.paymentDate)}</p>
                </div>
              )}
              
              {payment.paymentMethod && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                  <p className="text-base">{payment.paymentMethod}</p>
                </div>
              )}
              
              {payment.transactionId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                  <p className="text-base">{payment.transactionId}</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {canEdit && (type === 'premium' ? status !== 'Paid' : status === 'Pending') && (
          <>
            <Separator className="my-4" />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleProcessPayment)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Online">Online Payment</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction ID / Receipt Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Process Payment</Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
