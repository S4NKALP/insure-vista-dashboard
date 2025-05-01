
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
  const form = useForm({
    defaultValues: {
      paymentMethod: payment.paymentMethod || '',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: payment.transactionId || '',
      notes: '',
    }
  });
  
  const handleProcessPayment = (data: any) => {
    toast({
      title: "Payment processed",
      description: type === 'premium' 
        ? `Premium payment for policy ${payment.policyNumber} has been recorded` 
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
              ? `Policy: ${payment.policyNumber}`
              : `Claim: ${payment.claimId} | Policy: ${payment.policyNumber}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Policy Holder</h3>
            <p className="text-base">{payment.customerName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
            <p className="text-base font-semibold">{formatCurrency(payment.amount)}</p>
          </div>
          
          {type === 'premium' ? (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p className="text-base">{formatDate(payment.dueDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
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
              </div>
              
              {payment.paidDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Paid Date</h3>
                  <p className="text-base">{formatDate(payment.paidDate)}</p>
                </div>
              )}
              
              {payment.paymentMethod && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                  <p className="text-base">{payment.paymentMethod}</p>
                </div>
              )}
              
              {payment.receiptNumber && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Receipt Number</h3>
                  <p className="text-base">{payment.receiptNumber}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Beneficiary</h3>
                <p className="text-base">{payment.beneficiary}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
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
        
        {canEdit && payment.status === (type === 'premium' ? 'Pending' : 'Pending') && (
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
                  <Button type="submit">
                    {type === 'premium' ? 'Record Payment' : 'Process Payment'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        
        {(!canEdit || payment.status !== (type === 'premium' ? 'Pending' : 'Pending')) && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
