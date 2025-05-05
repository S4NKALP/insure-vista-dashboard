import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Branch, SalesAgent } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

// Schema matching SalesAgent structure more closely
// Make fields optional where appropriate for updates
const agentFormSchema = z.object({
  agent_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  agent_code: z.string().min(1, { message: "Agent code is required." }), // Required, likely not editable after creation
  // Assuming user link happens elsewhere or is derived
  branch: z.number().nullable(), // Branch ID
  status: z.string().default('ACTIVE'), // Default status
  commission_rate: z.coerce.number().min(0).max(1).optional().default(0.05), // 0 to 1 (e.g., 0.05 for 5%)
  is_active: z.boolean().default(true), // Add is_active field
  // Other fields like phone, email might need user association
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

// Match the types defined in mock/api.ts & AgentList.tsx
type CreateAgentData = Omit<SalesAgent, 'id' | 'total_policies_sold' | 'total_premium_collected' | 'user_details' | 'user'>;
// Assuming user ID needs to be linked separately if agent is also a user
type UpdateAgentData = Partial<Omit<CreateAgentData, 'agent_code'>>;

interface AgentFormProps {
  initialData?: SalesAgent | null; // Use the actual type
  onSubmit: (data: CreateAgentData | UpdateAgentData) => void;
  onCancel: () => void; // Add cancel handler
  issuperadmin: boolean;
  branches?: Branch[]; // Pass branches from parent
  isLoadingBranches?: boolean;
  defaultBranchId?: number; // For pre-filling branch for branch admins
  isSaving?: boolean; // For button state
}

export const AgentForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  issuperadmin, 
  branches = [], // Default to empty array
  isLoadingBranches,
  defaultBranchId,
  isSaving 
}: AgentFormProps) => {

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      agent_name: initialData?.agent_name || '',
      agent_code: initialData?.agent_code || '',
      branch: initialData?.branch ?? (issuperadmin ? null : defaultBranchId ?? null),
      status: initialData?.status || 'ACTIVE',
      commission_rate: initialData?.commission_rate ? parseFloat(initialData.commission_rate) : 0.05,
      is_active: initialData?.is_active ?? true,
    },
  });

  // Reset form if initialData changes (e.g., switching between add/edit)
  useEffect(() => {
    form.reset({
      agent_name: initialData?.agent_name || '',
      agent_code: initialData?.agent_code || '',
      branch: initialData?.branch ?? (issuperadmin ? null : defaultBranchId ?? null),
      status: initialData?.status || 'ACTIVE',
      commission_rate: initialData?.commission_rate ? parseFloat(initialData.commission_rate) : 0.05,
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData, form, issuperadmin, defaultBranchId]);

  const handleSubmit = (data: AgentFormValues) => {
    // Prepare data based on whether it's an add or update
    if (initialData) {
      // Construct Update payload EXCLUDING agent_code
      const { agent_code, ...updateData } = data;
      const submissionData: UpdateAgentData = {
          ...updateData,
          commission_rate: String(updateData.commission_rate), // Ensure correct type if API needs string
      };
      onSubmit(submissionData);
    } else {
      // Construct Create payload
      const selectedBranchName = branches.find(b => b.id === data.branch)?.name || 'Unknown'; // Get branch name
      // Explicitly map fields to satisfy CreateAgentData type requirements
      const submissionData: CreateAgentData = {
        agent_name: data.agent_name,         // Required
        agent_code: data.agent_code,         // Required
        branch: data.branch,               // Required (nullable)
        status: data.status,               // Required (has default)
        is_active: data.is_active,         // Required (has default)
        commission_rate: String(data.commission_rate), // Required (has default, ensure string)
        branch_name: selectedBranchName,     // Add derived branch_name (Required)
      };
      onSubmit(submissionData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        {/* Agent Name */}
        <FormField
          control={form.control}
          name="agent_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Full Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter agent's full name" disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
         {/* Agent Code (Readonly if editing) */}
         <FormField
          control={form.control}
          name="agent_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Code *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter unique agent code" disabled={!!initialData || isSaving} />
              </FormControl>
              {!initialData && <p className="text-xs text-muted-foreground">Agent code cannot be changed after creation.</p>}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Branch Assignment (superadmin only) */} 
           {issuperadmin && (
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Branch *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? Number(value) : null)} 
                      value={field.value ? String(field.value) : ''}
                      disabled={isLoadingBranches || isSaving}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select Branch"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingBranches ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : branches.length === 0 ? (
                           <SelectItem value="no-branch" disabled>No branches available</SelectItem>
                        ) : (
                          branches.map((branch) => (
                            <SelectItem key={branch.id} value={String(branch.id)}>
                              {branch.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          
           {/* Status */} 
           <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSaving}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                     {/* Add more statuses if needed */} 
                   </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Commission Rate */} 
         <FormField
            control={form.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                 {/* Display as percentage, store as decimal */} 
                 <FormLabel>Commission Rate (%)</FormLabel>
                <FormControl>
                   <Input 
                    {...field} 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    value={field.value !== undefined ? field.value * 100 : ''} // Display as %
                     onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) / 100 : undefined)} // Store as decimal
                    placeholder="e.g., 5 for 5%"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Active Status Toggle */} 
        <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2">
                    <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Inactive agents cannot perform certain actions.
                        </p>
                    </div>
                    <FormControl>
                        {/* Using Checkbox requires handling checked state differently than Select */}
                        {/* For simplicity, let's use Select for now */} 
                        <Select onValueChange={(val) => field.onChange(val === 'true')} value={String(field.value)} disabled={isSaving}>
                           <SelectTrigger className="w-[120px]">
                               <SelectValue />
                           </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                </FormItem>
            )}
        />

        {/* TODO: Add fields for email, phone if they become part of SalesAgent or linked user */}
        
        {/* Buttons */} 
         <div className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : initialData ? (
               'Update Agent'
             ) : (
               'Add Agent'
             )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
