import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Search, UserCheck, UserX, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { AgentApplicationDetails } from "@/components/agent/AgentApplicationDetails";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgentApplicationForm } from './AgentApplicationForm';
import { toast } from 'sonner';
import { AgentApplication, Branch } from '@/types';
import {
    getAgentApplications,
    getAgentApplicationsByBranch,
    addAgentApplication,
    updateAgentApplicationStatus,
    getBranches
} from '@/api/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from 'date-fns';
import { handleFormSubmission } from '@/utils/form-helpers';

interface AgentApplicationListProps {
  issuperadmin: boolean;
  branchId?: number;
}

// Type for creating a new agent application
type CreateAgentApplicationData = Omit<AgentApplication, 
  'id' | 'status' | 'created_at' | 'updated_at' | 'rejection_reason' | 'branch_name' | 'documents'
>;

// --- API Fetching Functions ---
const fetchApplications = async (issuperadmin: boolean, branchId?: number): Promise<AgentApplication[]> => {
    const fetchFn = issuperadmin ? getAgentApplications : () => getAgentApplicationsByBranch(branchId as number);
    console.log(`Fetching agent applications as ${issuperadmin ? 'superadmin' : 'BranchAdmin'}`);
    
    try {
      const response = await fetchFn();
      console.log('Agent applications API response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} applications`);
        return response.data;
      } else {
        console.error("API Error - unexpected response format:", response);
        throw new Error(response.message || 'Failed to fetch agent applications - unexpected data format');
      }
    } catch (error) {
      console.error("API Error fetching agent applications:", error);
      throw error;
    }
  };

const fetchBranches = async (): Promise<Branch[]> => {
    const response = await getBranches();
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("API Error fetching branches:", response);
      throw new Error(response.message || 'Failed to fetch branches');
    }
  };

// --- Component ---
export function AgentApplicationList({ issuperadmin, branchId }: AgentApplicationListProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AgentApplication['status']>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AgentApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // --- Data Queries ---
  const applicationsQueryKey = issuperadmin ? ['agentApplications'] : ['agentApplications', branchId];
  const { 
    data: applicationsData = [], 
    isLoading: isLoadingApplications, 
    isError: isErrorApplications, 
    error: errorApplications,
    refetch: refetchApplications
  } = useQuery<AgentApplication[], Error>({
    queryKey: applicationsQueryKey,
    queryFn: () => fetchApplications(issuperadmin, branchId),
    staleTime: 10 * 1000, // Reduce cache time to 10 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  });

  // Fetch branches only if super admin (for name lookup if needed)
  const { 
    data: branches = [], 
    isLoading: isLoadingBranches, 
    isError: isErrorBranches, 
  } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    enabled: issuperadmin, // Only run if super admin
    staleTime: Infinity, 
  });

  // Log applications data for debugging
  useEffect(() => {
    console.log('Applications data loaded:', applicationsData?.length || 0, 'items');
    if (applicationsData?.length) {
      console.log('Sample application:', applicationsData[0]);
    }
  }, [applicationsData]);

  // --- Mutations ---
  const addAgentApplicationMutation = useMutation({
    mutationFn: (newApplicationData: FormData | CreateAgentApplicationData) => addAgentApplication(newApplicationData),
    onSuccess: () => {
      toast.success("Application submitted successfully");
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey }); 
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit application: ${error.message}`);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status, reason }: { applicationId: number; status: 'APPROVED' | 'REJECTED'; reason?: string }) => 
        updateAgentApplicationStatus(applicationId, status, reason),
    onSuccess: (data, variables) => {
      toast.success(`Application ${variables.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey });
      setIsDetailsDialogOpen(false);
      setIsRejectDialogOpen(false);
      setSelectedApplication(null);
      setRejectionReason('');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  // --- Filtered Applications Memo ---
  const filteredApplications = useMemo(() => {
    return applicationsData.filter(app => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || (
        app.first_name?.toLowerCase().includes(lowerSearch) ||
        app.last_name?.toLowerCase().includes(lowerSearch) ||
        app.email?.toLowerCase().includes(lowerSearch) ||
        app.phone_number?.includes(searchTerm) ||
        app.branch_name?.toLowerCase().includes(lowerSearch)
      );
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applicationsData, searchTerm, statusFilter]);

  // --- Event Handlers ---
  const handleViewDetails = (application: AgentApplication) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitApplication = (formData: FormData | CreateAgentApplicationData) => {
    console.log("Submitting new application");
    
    // Handle FormData - ensure branch is set correctly
    if (formData instanceof FormData) {
      console.log("Handling FormData submission");
      
      // If branch admin and not superadmin, ensure branch ID is set
      if (!issuperadmin && branchId !== undefined) {
        // Check if branch is already set in FormData
        const existingBranch = formData.get('branch');
        if (!existingBranch) {
          // Add the branch ID if it's not already in the FormData
          formData.append('branch', String(branchId));
          console.log(`Added branch ID ${branchId} to FormData`);
        }
      }
      
      // Log the FormData entries for debugging
      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      addAgentApplicationMutation.mutate(formData);
    } 
    // Handle JSON data
    else {
      console.log("Handling JSON data submission", formData);
      const dataToSend = { ...formData };
      
      // If branch admin (not superadmin), ensure branch ID is set
      if (!issuperadmin && branchId !== undefined && !dataToSend.branch) {
        dataToSend.branch = branchId;
        console.log(`Added branch ID ${branchId} to JSON data`);
      }
      
      addAgentApplicationMutation.mutate(dataToSend);
    }
  };

  const handleApprove = (applicationId: number) => {
     console.log(`Approving application ${applicationId}`);
     updateStatusMutation.mutate({ applicationId, status: 'APPROVED' });
  };

  const handleRejectClick = (application: AgentApplication) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedApplication?.id) {
        if (!rejectionReason) {
            toast.error("Please provide a reason for rejection.");
            return;
        }
        
        console.log(`Rejecting application ${selectedApplication.id} with reason: ${rejectionReason}`);
        updateStatusMutation.mutate({ 
          applicationId: selectedApplication.id, 
          status: 'REJECTED', 
          reason: rejectionReason 
        });
    }
  };

   const getBranchName = (branchIdNum: number | null | undefined): string => {
     if (!branchIdNum) return 'N/A';
     // If branch name is provided by API, use it directly
     const appWithBranchName = applicationsData.find(a => a.branch === branchIdNum);
     if (appWithBranchName?.branch_name) return appWithBranchName.branch_name;
     
     // Otherwise, try to look it up if super admin
     if (issuperadmin && !isLoadingBranches && branches.length > 0) {
        const branch = branches.find(b => b.id === branchIdNum);
        return branch ? branch.name : `Branch ID: ${branchIdNum}`;
     } 
     // Fallback if branch admin or branches not loaded
     return `Branch ID: ${branchIdNum}`;
   };
   
  // --- Render ---
  return (
    <div className="w-full flex flex-col">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2">
            <CardTitle>Agent Applications</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => refetchApplications()}
              title="Refresh Applications"
              disabled={isLoadingApplications}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingApplications ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>New Application</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Agent Application</DialogTitle>
                <DialogDescription>Fill in the details to submit a new agent application.</DialogDescription>
              </DialogHeader>
              <AgentApplicationForm 
                onSubmit={handleSubmitApplication} 
                onCancel={() => setIsFormOpen(false)}
                isSaving={addAgentApplicationMutation.isPending}
                issuperadmin={issuperadmin}
                branches={issuperadmin && !isErrorBranches ? branches : []}
                isLoadingBranches={isLoadingBranches}
                defaultBranchId={!issuperadmin ? branchId : undefined}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
                disabled={isLoadingApplications}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} disabled={isLoadingApplications}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

         {isErrorApplications && (
           <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Applications</AlertTitle>
            <AlertDescription>
              {errorApplications?.message || 'An unexpected error occurred.'} Please try refreshing.
            </AlertDescription>
          </Alert>
         )}
          {isErrorBranches && issuperadmin && (
            <Alert variant="default" className="mb-4">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Warning Loading Branches</AlertTitle>
             <AlertDescription>
               Branch names might not display correctly.
             </AlertDescription>
           </Alert>
         )}

          <div className="rounded-md border overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  {issuperadmin && <TableHead>Branch</TableHead>}
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingApplications ? (
                   [...Array(8)].map((_, i) => (
                    <TableRow key={`skel-app-${i}`}>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      {issuperadmin && <TableCell><Skeleton className="h-5 w-full" /></TableCell>}
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={issuperadmin ? 6 : 5} className="h-24 text-center">
                      No applications found{searchTerm || statusFilter !== 'all' ? ' matching your criteria' : ''}.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {`${application.first_name} ${application.last_name}`}
                      </TableCell>
                      <TableCell>
                         <div>{application.email}</div>
                         <div className="text-xs text-muted-foreground">{application.phone_number}</div>
                      </TableCell>
                      {issuperadmin && <TableCell>{getBranchName(application.branch)}</TableCell>}
                       <TableCell>{format(new Date(application.created_at), 'PP')} </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === 'APPROVED'
                              ? 'default'
                              : application.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="capitalize"
                        >
                          {application.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                           <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(application)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                           {application.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                                onClick={() => handleApprove(application.id)}
                                disabled={updateStatusMutation.isPending}
                                title="Approve Application"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                onClick={() => handleRejectClick(application)}
                                disabled={updateStatusMutation.isPending}
                                title="Reject Application"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedApplication && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details: {selectedApplication.first_name} {selectedApplication.last_name}</DialogTitle>
              <DialogDescription>
                 Branch: {getBranchName(selectedApplication.branch)} | Status: <span className="capitalize font-medium">{selectedApplication.status.toLowerCase()}</span>
              </DialogDescription>
            </DialogHeader>
             <AgentApplicationDetails application={selectedApplication} />
             <DialogFooter className="mt-4">
               {selectedApplication.status === 'PENDING' && (
                 <div className="flex-grow flex gap-2">
                   <Button variant="default" onClick={() => handleApprove(selectedApplication.id)} disabled={updateStatusMutation.isPending}>
                     <Check className="mr-2 h-4 w-4"/> Approve
                   </Button>
                   <Button variant="destructive" onClick={() => handleRejectClick(selectedApplication)} disabled={updateStatusMutation.isPending}>
                    <X className="mr-2 h-4 w-4"/> Reject
                   </Button>
                 </div>
               )}
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

       <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Confirm Rejection</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting the application from "{selectedApplication?.first_name} {selectedApplication?.last_name}".
              </DialogDescription>
            </DialogHeader>
             <div className="py-4 space-y-2">
                 <label htmlFor="rejectionReason" className="text-sm font-medium">Rejection Reason *</label>
                 <Textarea 
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason here..."
                    rows={4}
                    disabled={updateStatusMutation.isPending}
                 />
             </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={updateStatusMutation.isPending}>Cancel</Button>
              <Button variant="destructive" onClick={confirmReject} disabled={updateStatusMutation.isPending || !rejectionReason}>
                 {updateStatusMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  );
}