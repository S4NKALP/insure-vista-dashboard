import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { addLoanRepayment } from '@/api/mock/api';
import { Loan } from '@/types';

interface LoanRepaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
}

const formSchema = z.object({
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number'
    }),
  repayment_type: z.string().min(1, { message: 'Repayment type is required' }),
});

export const LoanRepaymentDialog: React.FC<LoanRepaymentDialogProps> = ({ 
  open, 
  onOpenChange,
  loan 
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      repayment_type: '',
    },
  });

  // Add custom validation for amount
  const validateAmount = (value: string) => {
    const amount = parseFloat(value);
    const remainingBalance = parseFloat(loan.remaining_balance);
    return amount <= remainingBalance;
  };

  const addRepaymentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Validate amount before making the API call
      if (!validateAmount(values.amount)) {
        throw new Error('Amount cannot exceed remaining balance');
      }

      const response = await addLoanRepayment({
        loan_id: loan.id,
        policy_holder_number: loan.policy_holder_number,
        repayment_date: new Date().toISOString().split('T')[0],
        amount: values.amount,
        repayment_type: values.repayment_type,
        remaining_loan_balance: (
          parseFloat(loan.remaining_balance) - parseFloat(values.amount)
        ).toString(),
        loan: loan.id
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to record loan repayment');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch loans and repayments
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loanRepayments'] });
      
      // Show success message
      toast.success('Loan repayment recorded successfully');
      
      // Close the dialog and reset the form
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record loan repayment');
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addRepaymentMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Loan Repayment</DialogTitle>
          <DialogDescription>
            Record a payment for loan #{loan.id} - {loan.customer_name}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Original Amount</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(parseFloat(loan.loan_amount))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(parseFloat(loan.remaining_balance))}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Accrued Interest</p>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatCurrency(parseFloat(loan.accrued_interest))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Interest Date</p>
                  <p className="text-lg font-semibold">
                    {loan.last_interest_date}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter payment amount" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repayment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Principal">Principal Only</SelectItem>
                        <SelectItem value="Interest">Interest Only</SelectItem>
                        <SelectItem value="Both">Principal & Interest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={addRepaymentMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addRepaymentMutation.isPending}
              >
                {addRepaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 