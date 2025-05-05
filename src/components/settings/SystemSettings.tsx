
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SystemSettingsProps {
  issuperadmin: boolean;
}

const formSchema = z.object({
  defaultInterestRate: z.string(),
  maxLoanPercentage: z.string(),
  enableLoanModule: z.boolean(),
  enableClaimAutomation: z.boolean(),
  defaultCurrency: z.string(),
  maintenanceMode: z.boolean(),
  dataBackupFrequency: z.string(),
});

export const SystemSettings: React.FC<SystemSettingsProps> = ({ issuperadmin }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultInterestRate: '9.5',
      maxLoanPercentage: '90',
      enableLoanModule: true,
      enableClaimAutomation: false,
      defaultCurrency: 'NPR',
      maintenanceMode: false,
      dataBackupFrequency: 'daily',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would make an API call to save settings
    console.log('Saving system settings:', values);
    toast.success('System settings updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>
          Manage global system settings and configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="defaultInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} disabled={!issuperadmin} />
                    </FormControl>
                    <FormDescription>
                      Default interest rate for new loans
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxLoanPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Loan Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={!issuperadmin} />
                    </FormControl>
                    <FormDescription>
                      Maximum percentage of policy value that can be loaned
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!issuperadmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NPR">Nepalese Rupee (NPR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Currency used throughout the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataBackupFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Backup Frequency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!issuperadmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often system data is backed up
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enableLoanModule"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Loan Module</FormLabel>
                      <FormDescription>
                        Allow loan applications and management
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!issuperadmin}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableClaimAutomation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Claim Automation</FormLabel>
                      <FormDescription>
                        Automatically process simple claims
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!issuperadmin}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <FormDescription>
                        Put system in maintenance mode (only admins can access)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!issuperadmin}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {issuperadmin && (
              <div className="flex justify-end">
                <Button type="submit">Save Settings</Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
