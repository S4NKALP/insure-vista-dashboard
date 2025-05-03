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

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PremiumPayment;
}

export const EditPaymentDialog = ({ 
  open, 
  onOpenChange, 
  payment
}: EditPaymentDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      amount: '',
      paymentMethod: '',
      paymentDate: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      notes: '',
    }
  });
  
  const handleRecordPayment = (data: any) => {
    // In a real application, this would call an API to update the payment
    toast({
      title: "Payment recorded",
      description: `Payment of ${data.amount} for policy ${payment.policy_holder_number} has been recorded`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Record Premium Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for policy {payment.policy_holder_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Policy Holder</h3>
            <p className="text-base">{payment.customer_name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Annual Premium</h3>
            <p className="text-base">{payment.annual_premium}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Paid</h3>
            <p className="text-base">{payment.total_paid}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
            <p className="text-base">{payment.remaining_premium}</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRecordPayment)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter amount" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt/Transaction Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter receipt number" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Add notes (optional)" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Record Payment</Button>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 