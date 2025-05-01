
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPaymentDialog = ({ open, onOpenChange }: AddPaymentDialogProps) => {
  const { toast } = useToast();
  const [paymentType, setPaymentType] = React.useState('premium');
  
  const premiumForm = useForm({
    defaultValues: {
      policyNumber: '',
      amount: '',
      paymentMethod: '',
      paymentDate: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      notes: '',
    }
  });
  
  const claimForm = useForm({
    defaultValues: {
      claimId: '',
      policyNumber: '',
      amount: '',
      beneficiary: '',
      beneficiaryAccount: '',
      paymentMethod: '',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: '',
      notes: '',
    }
  });
  
  const handleAddPremiumPayment = (data: any) => {
    toast({
      title: "Premium payment added",
      description: `Premium payment for policy ${data.policyNumber} has been recorded`,
    });
    onOpenChange(false);
  };
  
  const handleAddClaimPayment = (data: any) => {
    toast({
      title: "Claim payment added",
      description: `Claim payment for claim ${data.claimId} has been processed`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Record a new premium payment or process a claim payment
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="premium" onValueChange={setPaymentType}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="premium">Premium Payment</TabsTrigger>
            <TabsTrigger value="claim">Claim Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="premium">
            <Form {...premiumForm}>
              <form onSubmit={premiumForm.handleSubmit(handleAddPremiumPayment)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={premiumForm.control}
                    name="policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter policy number" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={premiumForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} placeholder="Enter amount" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={premiumForm.control}
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
                    control={premiumForm.control}
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
                    control={premiumForm.control}
                    name="receiptNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receipt Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter receipt number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={premiumForm.control}
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
                </div>
                
                <DialogFooter>
                  <Button type="submit">Add Premium Payment</Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="claim">
            <Form {...claimForm}>
              <form onSubmit={claimForm.handleSubmit(handleAddClaimPayment)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={claimForm.control}
                    name="claimId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter claim ID" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
                    name="policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter policy number" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} placeholder="Enter amount" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
                    name="beneficiary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter beneficiary name" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
                    name="beneficiaryAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Account</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter account details" required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
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
                                <SelectItem value="Check">Check</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={claimForm.control}
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
                    control={claimForm.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter transaction ID" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Process Claim Payment</Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
