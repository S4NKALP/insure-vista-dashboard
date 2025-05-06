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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface KYCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  kycData?: {
    id: number;
    document_type: string;
    document_number: string;
    document_front: string;
    document_back: string;
    pan_number: string | null;
    pan_front: string | null;
    pan_back: string | null;
    pp_photo: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
    nearest_hospital: string;
    natural_hazard_exposure: string;
    status: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
    };
  };
}

const formSchema = z.object({
  document_type: z.string().min(1, { message: 'Document type is required' }),
  document_number: z.string().min(1, { message: 'Document number is required' }),
  document_front: z.string().min(1, { message: 'Document front image is required' }),
  document_back: z.string().min(1, { message: 'Document back image is required' }),
  pan_number: z.string().optional(),
  pan_front: z.string().optional(),
  pan_back: z.string().optional(),
  pp_photo: z.string().min(1, { message: 'Profile photo is required' }),
  province: z.string().min(1, { message: 'Province is required' }),
  district: z.string().min(1, { message: 'District is required' }),
  municipality: z.string().min(1, { message: 'Municipality is required' }),
  ward: z.string().min(1, { message: 'Ward is required' }),
  nearest_hospital: z.string().min(1, { message: 'Nearest hospital is required' }),
  natural_hazard_exposure: z.string().min(1, { message: 'Natural hazard exposure is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
});

export const KYCDialog: React.FC<KYCDialogProps> = ({
  open,
  onOpenChange,
  mode,
  kycData,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'edit' && kycData ? {
      document_type: kycData.document_type,
      document_number: kycData.document_number,
      document_front: kycData.document_front,
      document_back: kycData.document_back,
      pan_number: kycData.pan_number || "",
      pan_front: kycData.pan_front || "",
      pan_back: kycData.pan_back || "",
      pp_photo: kycData.pp_photo,
      province: kycData.province,
      district: kycData.district,
      municipality: kycData.municipality,
      ward: kycData.ward,
      nearest_hospital: kycData.nearest_hospital,
      natural_hazard_exposure: kycData.natural_hazard_exposure,
      status: kycData.status,
    } : {
      document_type: "",
      document_number: "",
      document_front: "",
      document_back: "",
      pan_number: "",
      pan_front: "",
      pan_back: "",
      pp_photo: "",
      province: "",
      district: "",
      municipality: "",
      ward: "",
      nearest_hospital: "",
      natural_hazard_exposure: "low",
      status: "Pending",
    },
  });

  // Reset form when dialog opens/closes or kycData changes
  React.useEffect(() => {
    if (open && mode === 'edit' && kycData) {
      form.reset({
        document_type: kycData.document_type,
        document_number: kycData.document_number,
        document_front: kycData.document_front,
        document_back: kycData.document_back,
        pan_number: kycData.pan_number || "",
        pan_front: kycData.pan_front || "",
        pan_back: kycData.pan_back || "",
        pp_photo: kycData.pp_photo,
        province: kycData.province,
        district: kycData.district,
        municipality: kycData.municipality,
        ward: kycData.ward,
        nearest_hospital: kycData.nearest_hospital,
        natural_hazard_exposure: kycData.natural_hazard_exposure,
        status: kycData.status,
      });
    }
  }, [open, mode, kycData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success(`KYC ${mode === 'add' ? 'added' : 'updated'} successfully`);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add KYC' : 'Update KYC'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Add new KYC information for the policy holder.' : 'Update existing KYC information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="citizenship">Citizenship</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">Driving License</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_front"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Front</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_back"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Back</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pan_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter PAN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pp_photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter district" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter municipality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nearest_hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearest Hospital</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter nearest hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="natural_hazard_exposure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Natural Hazard Exposure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hazard exposure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'add' ? 'Add KYC' : 'Update KYC'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 