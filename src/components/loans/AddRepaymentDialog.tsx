
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface AddRepaymentDialogProps {
  loan: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}

const formSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  reference: z.string().min(1, { message: 'Reference is required' }),
});

export const AddRepaymentDialog: React.FC<AddRepaymentDialogProps> = ({ 
  loan,
  open,
  onOpenChange,
  canEdit
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would make an API call
    console.log('Adding repayment:', values, 'for loan:', loan.id);
    
    // Show success message
    toast.success('Repayment recorded successfully');
    
    // Close the dialog and reset the form
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Loan Repayment</DialogTitle>
          <DialogDescription>
            Record a new repayment for loan {loan.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm">Outstanding Amount:</span>
            <span className="font-bold">{formatCurrency(loan.amountDue || loan.amount)}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repayment Amount (Rs.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter amount" 
                      {...field} 
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Payment</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Reference</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Check number, bank transfer ID, etc." 
                      {...field} 
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {canEdit && (
                <Button type="submit">Record Payment</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
