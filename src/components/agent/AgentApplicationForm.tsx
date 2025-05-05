import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Branch, AgentApplication } from '@/types';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { handleFormSubmission, validateRequiredFields } from '@/utils/form-helpers';
import { toast } from 'sonner';

const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  father_name: z.string().min(1, 'Father name is required'),
  mother_name: z.string().min(1, 'Mother name is required'),
  grand_father_name: z.string().optional().nullable(),
  grand_mother_name: z.string().optional().nullable(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['M', 'F', 'O'], { required_error: 'Gender is required' }),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  branch: z.number().nullable(),
  resume: z.any().optional().nullable(),
  citizenship_front: z.any().optional().nullable(),
  citizenship_back: z.any().optional().nullable(),
  license_front: z.any().optional().nullable(),
  license_back: z.any().optional().nullable(),
  pp_photo: z.any().optional().nullable(),
  license_number: z.string().min(1, 'License number is required').nullable(),
  license_issue_date: z.string().min(1, 'License issue date is required').nullable(),
  license_expiry_date: z.string().min(1, 'License expiry date is required').nullable(),
  license_type: z.string().min(1, 'License type is required').nullable(),
  license_issue_district: z.string().min(1, 'License issue district is required').nullable(),
  license_issue_zone: z.string().min(1, 'License issue zone is required').nullable(),
  license_issue_province: z.string().min(1, 'License issue province is required').nullable(),
  license_issue_country: z.string().min(1, 'License issue country is required').nullable(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateAgentApplicationData = Omit<AgentApplication, 
    'id' | 'status' | 'created_at' | 'rejection_reason' | 'branch_name' |
    'resume' | 'citizenship_front' | 'citizenship_back' | 'license_front' | 'license_back' | 'pp_photo'
>;

interface AgentApplicationFormProps {
  onSubmit: (data: FormData | CreateAgentApplicationData) => void;
  onCancel: () => void;
  isSaving?: boolean;
  issuperadmin: boolean;
  branches?: Branch[];
  isLoadingBranches?: boolean;
  defaultBranchId?: number;
}

export function AgentApplicationForm({
   onSubmit, 
   onCancel, 
   isSaving,
   issuperadmin,
   branches = [],
   isLoadingBranches,
   defaultBranchId 
  }: AgentApplicationFormProps) {
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      father_name: '',
      mother_name: '',
      grand_father_name: null,
      grand_mother_name: null,
      date_of_birth: '',
      gender: undefined,
      email: '',
      phone_number: '',
      address: '',
      branch: issuperadmin ? null : defaultBranchId ?? null,
      resume: null,
      citizenship_front: null,
      citizenship_back: null,
      license_front: null,
      license_back: null,
      pp_photo: null,
      license_number: null,
      license_issue_date: null,
      license_expiry_date: null,
      license_type: null,
      license_issue_district: null,
      license_issue_zone: null,
      license_issue_province: null,
      license_issue_country: null,
    },
  });

  useEffect(() => {
    if (issuperadmin) {
      form.register('branch', { required: 'Branch selection is required.' });
    } else {
       form.setValue('branch', defaultBranchId ?? null);
    }
  }, [issuperadmin, form, defaultBranchId]);

  const handleSubmit = (data: FormValues) => {
    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(data, [
      'first_name',
      'last_name',
      'father_name',
      'mother_name',
      'date_of_birth',
      'gender',
      'email',
      'phone_number',
      'address'
    ]);
    
    if (!isValid) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add text fields first
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('father_name', data.father_name);
    formData.append('mother_name', data.mother_name);
    
    if (data.grand_father_name) {
      formData.append('grand_father_name', data.grand_father_name);
    }
    
    if (data.grand_mother_name) {
      formData.append('grand_mother_name', data.grand_mother_name);
    }
    
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('gender', data.gender);
    formData.append('email', data.email);
    formData.append('phone_number', data.phone_number);
    formData.append('address', data.address);
    
    // Add branch ID
    const branchId = issuperadmin ? data.branch : defaultBranchId;
    if (branchId) {
      formData.append('branch', String(branchId));
    }
    
    // Add license information
    if (data.license_number) {
      formData.append('license_number', data.license_number);
    }
    
    if (data.license_issue_date) {
      formData.append('license_issue_date', data.license_issue_date);
    }
    
    if (data.license_expiry_date) {
      formData.append('license_expiry_date', data.license_expiry_date);
    }
    
    if (data.license_type) {
      formData.append('license_type', data.license_type);
    }
    
    if (data.license_issue_district) {
      formData.append('license_issue_district', data.license_issue_district);
    }
    
    if (data.license_issue_zone) {
      formData.append('license_issue_zone', data.license_issue_zone);
    }
    
    if (data.license_issue_province) {
      formData.append('license_issue_province', data.license_issue_province);
    }
    
    if (data.license_issue_country) {
      formData.append('license_issue_country', data.license_issue_country);
    }
    
    // Add file uploads
    if (data.resume instanceof File) {
      formData.append('resume', data.resume);
    }
    
    if (data.citizenship_front instanceof File) {
      formData.append('citizenship_front', data.citizenship_front);
    }
    
    if (data.citizenship_back instanceof File) {
      formData.append('citizenship_back', data.citizenship_back);
    }
    
    if (data.license_front instanceof File) {
      formData.append('license_front', data.license_front);
    }
    
    if (data.license_back instanceof File) {
      formData.append('license_back', data.license_back);
    }
    
    if (data.pp_photo instanceof File) {
      formData.append('pp_photo', data.pp_photo);
    }
    
    console.log("Form Data prepared with files:");
    // Log entries in FormData (for debugging)
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    // Call the parent component's onSubmit with the FormData
    onSubmit(formData as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
         <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Father's Name" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Mother's Name" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grand_father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grandfather's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Grandfather's Name (Optional)" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grand_mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grandmother's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Grandmother's Name (Optional)" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSaving}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email Address" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Full Address *</FormLabel>
                <FormControl>
                  <Input placeholder="Street, City, District" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                 {issuperadmin && form.formState.errors.branch && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.branch.message}</p>
                 )}
                </FormItem>
            )}
            />
         )}
         {!issuperadmin && defaultBranchId && (
             <div className="space-y-1">
                <Label>Branch</Label>
                <Input value={`Branch ID: ${defaultBranchId} (Auto-assigned)`} disabled />
             </div>
         )}

         <h3 className="text-lg font-semibold border-b pb-2 mb-4 pt-4">License Information</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="license_number" render={({ field }) => (<FormItem><FormLabel>License Number *</FormLabel><FormControl><Input placeholder="License Number" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_type" render={({ field }) => (<FormItem><FormLabel>License Type *</FormLabel><FormControl><Input placeholder="License Type (e.g., Bike, Car)" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_issue_date" render={({ field }) => (<FormItem><FormLabel>License Issue Date *</FormLabel><FormControl><Input type="date" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_expiry_date" render={({ field }) => (<FormItem><FormLabel>License Expiry Date *</FormLabel><FormControl><Input type="date" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_issue_district" render={({ field }) => (<FormItem><FormLabel>Issue District *</FormLabel><FormControl><Input placeholder="District Name" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_issue_zone" render={({ field }) => (<FormItem><FormLabel>Issue Zone *</FormLabel><FormControl><Input placeholder="Zone Name" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_issue_province" render={({ field }) => (<FormItem><FormLabel>Issue Province *</FormLabel><FormControl><Input placeholder="Province Name" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="license_issue_country" render={({ field }) => (<FormItem><FormLabel>Issue Country *</FormLabel><FormControl><Input placeholder="Country Name" {...field} disabled={isSaving} /></FormControl><FormMessage /></FormItem>)} />
         </div>

         <h3 className="text-lg font-semibold border-b pb-2 mb-4 pt-4">Documents</h3>
         <p className="text-sm text-muted-foreground mb-4">Upload the required documents.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="resume" render={({ field: { value, onChange, ...fieldProps } }) => (
               <FormItem>
                 <FormLabel>Resume</FormLabel>
                 <FormControl>
                   <Input 
                     {...fieldProps} 
                     type="file" 
                     onChange={(event) => onChange(event.target.files && event.target.files[0])}
                     disabled={isSaving} 
                     className="pt-2"
                     />
                  </FormControl>
                 <FormMessage />
               </FormItem>)} />
             
             <FormField control={form.control} name="pp_photo" render={({ field: { value, onChange, ...fieldProps } }) => (
               <FormItem>
                 <FormLabel>PP Size Photo</FormLabel>
                 <FormControl>
                     <Input {...fieldProps} type="file" onChange={(event) => onChange(event.target.files && event.target.files[0])} disabled={isSaving} className="pt-2"/>
                   </FormControl>
                  <FormMessage />
                </FormItem>)} />
             
             <FormField control={form.control} name="citizenship_front" render={({ field: { value, onChange, ...fieldProps } }) => (
               <FormItem>
                 <FormLabel>Citizenship (Front)</FormLabel>
                 <FormControl>
                     <Input {...fieldProps} type="file" onChange={(event) => onChange(event.target.files && event.target.files[0])} disabled={isSaving} className="pt-2"/>
                   </FormControl>
                  <FormMessage />
                </FormItem>)} />

             <FormField control={form.control} name="citizenship_back" render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                 <FormLabel>Citizenship (Back)</FormLabel>
                 <FormControl>
                      <Input {...fieldProps} type="file" onChange={(event) => onChange(event.target.files && event.target.files[0])} disabled={isSaving} className="pt-2"/>
                   </FormControl>
                  <FormMessage />
                </FormItem>)} />

             <FormField control={form.control} name="license_front" render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                 <FormLabel>License (Front)</FormLabel>
                 <FormControl>
                     <Input {...fieldProps} type="file" onChange={(event) => onChange(event.target.files && event.target.files[0])} disabled={isSaving} className="pt-2"/>
                   </FormControl>
                  <FormMessage />
                </FormItem>)} />

              <FormField control={form.control} name="license_back" render={({ field: { value, onChange, ...fieldProps } }) => (
                 <FormItem>
                  <FormLabel>License (Back)</FormLabel>
                  <FormControl>
                      <Input {...fieldProps} type="file" onChange={(event) => onChange(event.target.files && event.target.files[0])} disabled={isSaving} className="pt-2"/>
                   </FormControl>
                  <FormMessage />
                </FormItem>)} />
          </div>

        <div className="flex justify-end space-x-2 pt-6 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
             {isSaving ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 