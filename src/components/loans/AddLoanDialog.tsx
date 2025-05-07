import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { addLoan, getPolicyHolders } from '@/api/mock/api';

interface AddLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Create a schema for form validation
const formSchema = z.object({
  policy_holder: z.number({
    required_error: "Policy holder is required"
  }),
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
    defaultValues: {
      policy_holder: 0,
      loan_amount: '',
      interest_rate: '',
      loan_status: 'Active',
    },
  });
  
  // Fetch policy holders based on the branch ID from user context
  const { data: policyHoldersResponse, isLoading: loadingPolicyHolders } = useQuery({
    queryKey: ['policyHolders', user?.branch],
    queryFn: () => getPolicyHolders(user?.branch),
    enabled: open, // Only fetch when the dialog is open
  });
  
  const policyHolders = policyHoldersResponse?.data || [];

  const addLoanMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Find the selected policy holder
      const selectedPolicyHolder = policyHolders.find(ph => ph.id === values.policy_holder);
      
      if (!selectedPolicyHolder) {
        throw new Error('Selected policy holder not found');
      }

      const response = await addLoan({
        policy_holder: values.policy_holder,
        policy_holder_number: selectedPolicyHolder.policy_number,
        customer_name: selectedPolicyHolder.customer_name,
        loan_amount: values.loan_amount,
        interest_rate: values.interest_rate,
        loan_status: values.loan_status,
        remaining_balance: values.loan_amount, // Initially same as loan amount
        accrued_interest: '0', // Initially 0
        last_interest_date: new Date().toISOString().split('T')[0], // Today's date
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
    
    if (amount <= 0 || interestRate <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const term = 12; // Default to 12 months for calculation
    
    // Prevent division by zero
    if (monthlyRate === 0) return amount / term;
    
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
      (Math.pow(1 + monthlyRate, term) - 1);
    return monthlyPayment;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Loan</DialogTitle>
          <DialogDescription>
            Enter the loan details for the selected policy holder
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="policy_holder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Holder *</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value ? String(field.value) : undefined}
                    disabled={loadingPolicyHolders}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy holder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policyHolders.map((holder) => (
                        <SelectItem 
                          key={holder.id} 
                          value={String(holder.id)}
                        >
                          {holder.customer_name} ({holder.policy_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {form.watch('loan_amount') && form.watch('interest_rate') && (
              <Card>
                <CardContent className="pt-4 pb-4">
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
            )}

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
                disabled={addLoanMutation.isPending || loadingPolicyHolders}
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