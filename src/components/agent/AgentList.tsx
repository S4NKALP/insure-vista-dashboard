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
import { Edit, Trash2, UserPlus, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { AgentForm } from "@/components/agent/AgentForm";
import { toast } from 'sonner';
import { SalesAgent, Branch } from '@/types';
import { 
  getAgents, 
  getAgentsByBranch, 
  addAgent, 
  updateAgent, 
  deleteAgent, 
  getBranches 
} from '@/api/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from '@/lib/utils';

// --- Types --- 
// Match the types defined in mock/api.ts for add/update
type CreateAgentData = Omit<SalesAgent, 'id' | 'total_policies_sold' | 'total_premium_collected' | 'commission_rate' | 'user_details' | 'user'>; 
// Assuming user ID needs to be linked separately if agent is also a user
type UpdateAgentData = Partial<Omit<CreateAgentData, 'agent_code'>>; // Agent code likely shouldn't change

// --- API Fetching Functions ---
const fetchAgents = async (issuperadmin: boolean, branchId?: string): Promise<SalesAgent[]> => {
  console.log(`Fetching ${issuperadmin ? 'all' : 'branch'} agents (${issuperadmin ? 'superadmin' : `Branch ID: ${branchId}`})`);
  
  try {
    const fetchFn = issuperadmin ? getAgents : () => getAgentsByBranch(Number(branchId));
    const response = await fetchFn();
    
    console.log('Sales agents response:', {
      success: response.success,
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not an array',
      firstAgent: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null
    });
    
    if (response.success && Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.warn('API returned empty array of agents. This could be normal or might indicate an issue.');
      }
      return response.data;
    } else {
      console.error("API Error - unexpected format in agent response:", response);
      throw new Error(response.message || 'Failed to fetch agents - unexpected data format');
    }
  } catch (error) {
    console.error("API Error fetching agents:", error);
    throw error;
  }
};

const fetchBranches = async (): Promise<Branch[]> => {
  console.log('Fetching branches for dropdown');
  
  try {
    const response = await getBranches();
    
    console.log('Branches response:', {
      success: response.success,
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not an array'
    });
    
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("API Error - unexpected format in branches response:", response);
      throw new Error(response.message || 'Failed to fetch branches - unexpected data format');
    }
  } catch (error) {
    console.error("API Error fetching branches:", error);
    throw error;
  }
};

// --- Component Props ---
interface AgentListProps {
  issuperadmin: boolean;
  branchId?: string; // Branch ID of the logged-in user if they are a branch admin
}

// --- Component ---
export const AgentList = ({ issuperadmin, branchId }: AgentListProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<SalesAgent | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<SalesAgent | null>(null);
  
  // --- Data Queries ---
  const agentsQueryKey = issuperadmin ? ['agents'] : ['agents', branchId];
  const { 
    data: agents = [], 
    isLoading: isLoadingAgents, 
    isError: isErrorAgents, 
    error: errorAgents,
    refetch: refetchAgents
  } = useQuery<SalesAgent[], Error>({
    queryKey: agentsQueryKey,
    queryFn: () => fetchAgents(issuperadmin, branchId),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  // Log agents data for debugging
  useEffect(() => {
    console.log('Agents data loaded:', agents?.length || 0, 'items');
    if (agents?.length) {
      console.log('Sample agent:', agents[0]);
    }
  }, [agents]);
  
  // Fetch branches only if super admin (for assignment dropdown)
  const { 
    data: branches = [], 
    isLoading: isLoadingBranches, 
    isError: isErrorBranches, 
    error: errorBranches 
  } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    enabled: issuperadmin, // Only run if super admin
    staleTime: 60 * 1000, // 1 minute
  });

  // --- Filtered Agents Memo ---
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        agent.agent_name?.toLowerCase().includes(lowerSearch) ||
        agent.agent_code?.toLowerCase().includes(lowerSearch) ||
        agent.branch_name?.toLowerCase().includes(lowerSearch) ||
        agent.status?.toLowerCase().includes(lowerSearch)
        // Add email/phone if those fields become available on SalesAgent type
      );
    });
  }, [agents, searchTerm]);

  // --- Mutations ---
  const addAgentMutation = useMutation({
    mutationFn: (newAgentData: CreateAgentData) => addAgent(newAgentData),
    onSuccess: () => {
      toast.success("Agent added successfully");
      queryClient.invalidateQueries({ queryKey: agentsQueryKey }); 
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add agent: ${error.message}`);
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ agentId, updatedData }: { agentId: number, updatedData: UpdateAgentData }) => updateAgent(agentId, updatedData),
    onSuccess: () => {
      toast.success("Agent updated successfully");
      queryClient.invalidateQueries({ queryKey: agentsQueryKey });
      setIsFormOpen(false);
      setEditingAgent(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update agent: ${error.message}`);
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (agentId: number) => deleteAgent(agentId),
    onSuccess: () => {
      toast.success("Agent deleted successfully");
      queryClient.invalidateQueries({ queryKey: agentsQueryKey });
      setIsDeleteDialogOpen(false);
      setAgentToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete agent: ${error.message}`);
    },
  });

  // --- Event Handlers ---
  const handleAddClick = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (agent: SalesAgent) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (agent: SalesAgent) => {
    setAgentToDelete(agent);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: CreateAgentData | UpdateAgentData) => {
    if (editingAgent) {
      // Update operation
      console.log(`Updating agent ${editingAgent.id}:`, formData);
      updateAgentMutation.mutate({ 
        agentId: editingAgent.id, 
        updatedData: formData as UpdateAgentData 
      });
    } else {
      // Add operation: ensure branch is assigned if not super admin
      const dataToSend: CreateAgentData = {
          ...(formData as CreateAgentData),
          branch: issuperadmin ? (formData as CreateAgentData).branch : Number(branchId) // Assign current branch if branch admin
      };
      console.log('Creating new agent:', dataToSend);
      addAgentMutation.mutate(dataToSend);
    }
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      console.log(`Deleting agent ${agentToDelete.id}`);
      deleteAgentMutation.mutate(agentToDelete.id);
    }
  };

  const getBranchName = (branchIdNum: number | null | undefined): string => {
     if (isLoadingBranches && issuperadmin) return 'Loading...';
     if (!branchIdNum) return 'N/A';
     if (!issuperadmin && branchId) {
       // If branch admin, try to get name from the loaded agent data (might be inconsistent)
       const agentWithBranchName = agents.find(a => a.branch === branchIdNum);
       return agentWithBranchName?.branch_name || `Branch ${branchIdNum}`;
     }
     // Super admin can look up in the loaded branches list
     const branch = branches.find(b => b.id === branchIdNum);
     return branch ? branch.name : 'Unknown Branch';
   };

  // --- Render ---
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle>Manage Agents</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refetchAgents()}
            title="Refresh Agents List"
            disabled={isLoadingAgents}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingAgents ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search agents..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoadingAgents}
            />
          </div>
           <Button onClick={handleAddClick} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Add Agent
          </Button>
        </div>
      </CardHeader>
      <CardContent>
         {/* Error Loading Data */} 
         {isErrorAgents && (
           <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Agents</AlertTitle>
            <AlertDescription>
              {errorAgents?.message || 'An unexpected error occurred.'} Please try refreshing.
            </AlertDescription>
          </Alert>
         )}
         {isErrorBranches && issuperadmin && (
            <Alert variant="default" className="mb-4"> {/* Use default for warning */} 
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Warning Loading Branches</AlertTitle>
             <AlertDescription>
               {errorBranches?.message || 'Could not load branch list.'} Branch assignment in form might be affected.
             </AlertDescription>
           </Alert>
         )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Agent Code</TableHead>
                {issuperadmin && <TableHead>Branch</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Policies Sold</TableHead>
                <TableHead>Total Premium</TableHead>
                {/* Add Contact Info if available */} 
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAgents ? (
                 [...Array(5)].map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    {issuperadmin && <TableCell><Skeleton className="h-5 w-full" /></TableCell>}
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={issuperadmin ? 8 : 7} className="h-24 text-center">
                    No agents found{searchTerm ? ' matching your criteria' : ''}.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.agent_name || '-'}</TableCell>
                    <TableCell>{agent.agent_code || '-'}</TableCell>
                    {issuperadmin && <TableCell>{getBranchName(agent.branch)}</TableCell>}
                    <TableCell>
                      <Badge variant={agent.status?.toUpperCase() === 'ACTIVE' ? "default" : "secondary"}>
                        {agent.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.commission_rate ? `${parseFloat(agent.commission_rate) * 100}%` : 'N/A'}</TableCell>
                    <TableCell>{agent.total_policies_sold ?? 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(parseFloat(agent.total_premium_collected || '0'))}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(agent)} title="Edit Agent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(agent)} title="Delete Agent" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* --- Dialogs --- */} 

       {/* Add/Edit Agent Dialog */} 
       <Dialog open={isFormOpen} onOpenChange={(open) => { 
           if (!open) setEditingAgent(null); // Reset editing state on close
           setIsFormOpen(open); 
       }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
               <DialogDescription>
                 {editingAgent ? `Update details for ${editingAgent.agent_name}` : "Fill in the details for the new agent."}
               </DialogDescription>
            </DialogHeader>
             {/* Pass branches only if super admin and loaded successfully */} 
             <AgentForm 
              initialData={editingAgent}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              issuperadmin={issuperadmin}
              branches={issuperadmin && !isErrorBranches ? branches : []}
              isLoadingBranches={isLoadingBranches}
              defaultBranchId={!issuperadmin ? Number(branchId) : undefined}
              isSaving={addAgentMutation.isPending || updateAgentMutation.isPending}
            />
          </DialogContent>
        </Dialog>

       {/* Delete Confirmation Dialog */} 
       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the agent "{agentToDelete?.agent_name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteAgentMutation.isPending}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteAgentMutation.isPending}>
                 {deleteAgentMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </Card>
  );
};
