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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { addLoan } from '@/api/mock/api';

interface AddLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  policy_holder_number: z.string().min(1, { message: 'Policy holder number is required' }),
  customer_name: z.string().min(1, { message: 'Customer name is required' }),
  loan_amount: z.string()
    .min(1, { message: 'Loan amount is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Loan amount must be a positive number'
    }),
  interest_rate: z.string()
    .min(1, { message: 'Interest rate is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: 'Interest rate must be between 0 and 100'
    }),
  loan_status: z.string().min(1, { message: 'Loan status is required' }),
});

export const AddLoanDialog: React.FC<AddLoanDialogProps> = ({ 
  open, 
  onOpenChange,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy_holder_number: '',
      customer_name: '',
      loan_amount: '',
      interest_rate: '',
      loan_status: '',
    },
  });

  const addLoanMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await addLoan({
        ...values,
        remaining_balance: values.loan_amount,
        accrued_interest: '0',
        last_interest_date: new Date().toISOString().split('T')[0],
        policy_holder: 0, // This will be set by the backend
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add loan');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch loans
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      
      // Show success message
      toast.success('Loan added successfully');
      
      // Close the dialog and reset the form
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add loan');
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addLoanMutation.mutate(values);
  };

  const calculateMonthlyPayment = () => {
    const amount = Number(form.watch('loan_amount')) || 0;
    const interestRate = Number(form.watch('interest_rate')) || 0;
    const monthlyRate = interestRate / 100 / 12;
    const term = 12; // Default to 12 months for calculation
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
      (Math.pow(1 + monthlyRate, term) - 1);
    return monthlyPayment;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Loan</DialogTitle>
          <DialogDescription>
            Enter the details for the new loan
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="policy_holder_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Holder Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter policy holder number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loan_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter loan amount" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interest_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter interest rate" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loan_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Status *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Defaulted">Defaulted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(calculateMonthlyPayment())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Interest</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(
                        calculateMonthlyPayment() * 12 - 
                        Number(form.watch('loan_amount') || 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={addLoanMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addLoanMutation.isPending}
              >
                {addLoanMutation.isPending ? 'Adding...' : 'Add Loan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
