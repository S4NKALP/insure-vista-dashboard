
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const policyTypes = ["Endownment", "Term", "Whole Life", "Money Back"];

const policySchema = z.object({
  name: z.string().min(2, { message: "Policy name must be at least 2 characters." }),
  policy_code: z.string().min(2, { message: "Policy code is required." }),
  policy_type: z.string().min(1, { message: "Policy type is required." }),
  base_multiplier: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid number." }),
  min_sum_assured: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid number." }),
  max_sum_assured: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid number." }),
  include_adb: z.boolean().default(false),
  include_ptd: z.boolean().default(false),
  adb_percentage: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid percentage." }),
  ptd_percentage: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid percentage." }),
  description: z.string().optional(),
  guaranteed_interest_rate: z.string().regex(/^\d+(\.\d{1,4})?$/, { message: "Enter a valid rate (e.g., 0.0450 for 4.5%)." }),
  terminal_bonus_rate: z.string().regex(/^\d+(\.\d{1,4})?$/, { message: "Enter a valid rate (e.g., 0.1000 for 10%)." }),
});

type PolicyFormValues = z.infer<typeof policySchema>;

interface AddPolicyFormProps {
  onCancel: () => void;
}

export const AddPolicyForm = ({ onCancel }: AddPolicyFormProps) => {
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: "",
      policy_code: "",
      policy_type: "Endownment",
      base_multiplier: "1.00",
      min_sum_assured: "25000.00",
      max_sum_assured: "5000000.00",
      include_adb: true,
      include_ptd: true,
      adb_percentage: "0.50",
      ptd_percentage: "0.50",
      description: "",
      guaranteed_interest_rate: "0.0450",
      terminal_bonus_rate: "0.1000",
    },
  });

  const onSubmit = (values: PolicyFormValues) => {
    console.log(values);
    // Here you would typically send the data to your backend
    // For now, we'll just log it and cancel the form
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter policy name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="policy_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter policy code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="policy_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {policyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="base_multiplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Multiplier</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="1.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="min_sum_assured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Sum Assured</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="25000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_sum_assured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Sum Assured</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="5000000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-6">
            <FormField
              control={form.control}
              name="include_adb"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include ADB</FormLabel>
                    <FormDescription>
                      Accidental Death Benefit
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="include_ptd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include PTD</FormLabel>
                    <FormDescription>
                      Permanent Total Disability
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="adb_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ADB Percentage</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ptd_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PTD Percentage</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="guaranteed_interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guaranteed Interest Rate</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.0450" {...field} />
                </FormControl>
                <FormDescription>
                  Enter as decimal (e.g., 0.0450 for 4.5%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="terminal_bonus_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal Bonus Rate</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.1000" {...field} />
                </FormControl>
                <FormDescription>
                  Enter as decimal (e.g., 0.1000 for 10%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter policy details and description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Policy</Button>
        </div>
      </form>
    </Form>
  );
};
