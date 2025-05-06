import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Building,
  Plus,
  Search,
  Edit,
  Users,
  Eye,
  FileCheck,
  DollarSign,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';
import { Branch, SalesAgent, AgentReport, PolicyHolder } from '@/types';
import { 
  getBranches, 
  addBranch, 
  updateBranch,
  deleteBranch,
  getAgentsByBranch, 
  getPolicyHoldersByBranch,
  getAgentReportsByBranch
} from '@/api/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- API Fetching Functions ---

const fetchBranches = async (): Promise<Branch[]> => {
  const response = await getBranches();
  if (response.success) {
    return Array.isArray(response.data) ? response.data : [];
  } else {
    throw new Error(response.message || 'Failed to fetch branches');
  }
};

const fetchAgentsForBranch = async (branchId: number | null): Promise<SalesAgent[]> => {
  if (!branchId) return [];
  const response = await getAgentsByBranch(branchId);
  if (response.success) {
    return response.data || [];
  } else {
    throw new Error(response.message || 'Failed to fetch agents');
  }
};

const fetchPolicyHoldersForBranch = async (branchId: number | null): Promise<PolicyHolder[]> => {
  if (!branchId) return [];
  const response = await getPolicyHoldersByBranch(branchId);
  if (response.success) {
    return response.data || [];
  } else {
    throw new Error(response.message || 'Failed to fetch policy holders');
  }
};

const fetchAgentReportsForBranch = async (branchId: number | null): Promise<AgentReport[]> => {
  if (!branchId) return [];
  const response = await getAgentReportsByBranch(branchId);
  if (response.success) {
    return response.data || [];
  } else {
    throw new Error(response.message || 'Failed to fetch agent reports');
  }
};

// --- Component ---

const BranchManagement = () => {
  const { user } = useAuth();
  const { isSuperAdmin, userBranchId } = usePermissions();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isViewBranchOpen, setIsViewBranchOpen] = useState(false);
  const [isEditBranchOpen, setIsEditBranchOpen] = useState(false); 
  const [isDeleteBranchOpen, setIsDeleteBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchFormData, setBranchFormData] = useState<Omit<Branch, 'id' | 'user_details'>>({
    name: '',
    branch_code: 0,
    location: '',
    company: 1, // Default company ID
    company_name: 'Easy Life Insurance LTD.', // Default or fetch dynamically
    user: null, // Manager ID
  });
  
  // --- Data Queries ---
  const { 
    data: branches = [], 
    isLoading: isLoadingBranches, 
    isError: isErrorBranches, 
    error: errorBranches 
  } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: 5 * 60 * 1000, // Cache 5 mins
  });

  // Filter branches based on permissions and search term
  const filteredBranches = useMemo(() => {
    let filtered = [...branches];
    if (!isSuperAdmin && userBranchId) {
      filtered = filtered.filter(branch => branch.id === userBranchId);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(branch => 
        branch.name?.toLowerCase().includes(lowerSearchTerm) ||
        String(branch.branch_code)?.toLowerCase().includes(lowerSearchTerm) ||
        branch.location?.toLowerCase().includes(lowerSearchTerm) ||
        branch.user_details?.first_name?.toLowerCase().includes(lowerSearchTerm) ||
        branch.user_details?.last_name?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return filtered;
  }, [branches, isSuperAdmin, userBranchId, searchTerm]);

  // Query for details when the view dialog is open
  const { 
    data: viewAgents = [], 
    isLoading: isLoadingViewAgents 
  } = useQuery<SalesAgent[], Error>({
    queryKey: ['agents', selectedBranch?.id],
    queryFn: () => fetchAgentsForBranch(selectedBranch?.id ?? null),
    enabled: !!selectedBranch && isViewBranchOpen, // Only fetch when dialog is open and branch selected
    staleTime: 2 * 60 * 1000, // Cache 2 mins
  });

  useQuery<PolicyHolder[], Error>({
    queryKey: ['policyHolders', selectedBranch?.id],
    queryFn: () => fetchPolicyHoldersForBranch(selectedBranch?.id ?? null),
    enabled: !!selectedBranch && isViewBranchOpen,
    staleTime: 2 * 60 * 1000,
  });

  const { 
    data: viewAgentReports = [], 
    isLoading: isLoadingViewAgentReports 
  } = useQuery<AgentReport[], Error>({
    queryKey: ['agentReports', selectedBranch?.id],
    queryFn: () => fetchAgentReportsForBranch(selectedBranch?.id ?? null),
    enabled: !!selectedBranch && isViewBranchOpen && !isEditBranchOpen, // Fetch only for view dialog staff/reports tab
    staleTime: 2 * 60 * 1000,
  });
  
  // Calculate total stats from all branches
  const totalStats = useMemo(() => {
    return branches.reduce((acc, branch) => {
      return {
        totalBranches: branches.length,
        totalManagers: acc.totalManagers + (branch.user ? 1 : 0),
        totalAgents: acc.totalAgents + (branch.total_agents || 0),
        totalPolicies: acc.totalPolicies + (branch.total_policies || 0),
        totalPremium: acc.totalPremium + (branch.total_premium || 0)
      };
    }, {
      totalBranches: 0,
      totalManagers: 0,
      totalAgents: 0,
      totalPolicies: 0,
      totalPremium: 0
    });
  }, [branches]);

  // --- Mutations ---
  const addBranchMutation = useMutation({
    mutationFn: (newBranchData: Omit<Branch, 'id' | 'user_details'>) => addBranch(newBranchData),
    onSuccess: () => {
      toast.success("Branch added successfully");
      queryClient.invalidateQueries({ queryKey: ['branches'] }); // Refetch branches list
      setIsAddBranchOpen(false);
      resetBranchForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add branch: ${error.message}`);
    },
  });
  
  const updateBranchMutation = useMutation({
    mutationFn: (branchData: Branch) => updateBranch(branchData), // Assuming updateBranch takes full Branch object
    onSuccess: () => {
      toast.success("Branch updated successfully");
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['agents', selectedBranch?.id] }); // May need updates if manager changed
      setIsEditBranchOpen(false);
      resetBranchForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update branch: ${error.message}`);
    },
  });

  const deleteBranchMutation = useMutation({
    mutationFn: (branchId: number) => deleteBranch(branchId),
    onSuccess: () => {
      toast.success("Branch deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setIsDeleteBranchOpen(false);
      setSelectedBranch(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete branch: ${error.message}`);
    },
  });

  // --- Event Handlers ---
  const handleAddClick = () => {
    resetBranchForm();
    setIsAddBranchOpen(true);
  };
  
  const handleEditClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchFormData({
      name: branch.name || '',
      branch_code: branch.branch_code || 0,
      location: branch.location || '',
      company: branch.company || 1,
      company_name: branch.company_name || 'Easy Life Insurance LTD.',
      user: branch.user || null,
      
    });
    setIsEditBranchOpen(true);
  };
  
  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteBranchOpen(true);
  };

  const handleViewClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewBranchOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBranchFormData(prev => ({ ...prev, [id]: id === 'branch_code' || id === 'user' ? (value ? Number(value) : null) : value }));
  };

  const handleSaveAdd = () => {
    if (!branchFormData.name || !branchFormData.branch_code || !branchFormData.location) {
      toast.error("Please fill in Branch Name, Code, and Location.");
      return;
    }
    addBranchMutation.mutate(branchFormData);
  };
  
  const handleSaveUpdate = () => {
    if (!selectedBranch) return;
    if (!branchFormData.name || !branchFormData.branch_code || !branchFormData.location) {
      toast.error("Please fill in Branch Name, Code, and Location.");
      return;
    }
     // Construct the full branch object for update
     const branchToUpdate: Branch = {
        ...selectedBranch, // Keep existing fields like id, company_name, user_details
        name: branchFormData.name,
        branch_code: branchFormData.branch_code,
        location: branchFormData.location,
        company: branchFormData.company,
        company_name: branchFormData.company_name,
        user: branchFormData.user,
      };
    updateBranchMutation.mutate(branchToUpdate);
  };
  
  const confirmDelete = () => {
    if (selectedBranch?.id) {
      deleteBranchMutation.mutate(selectedBranch.id);
    }
  };

  const resetBranchForm = () => {
    setSelectedBranch(null);
    setBranchFormData({
      name: '',
      branch_code: 0,
      location: '',
      company: 1,
      company_name: 'Easy Life Insurance LTD.',
      user: null,
    });
  };

  // --- Render ---
  return (
    <DashboardLayout title="Branch Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <PermissionGate permission="manage_branches">
            <Button 
              className="flex items-center gap-2"
              onClick={handleAddClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Branch
            </Button>
          </PermissionGate>
        </div>
        
        {/* Overall Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingBranches ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{totalStats.totalBranches}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branch Managers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoadingBranches ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{totalStats.totalManagers}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoadingBranches ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{totalStats.totalPolicies}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingBranches ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{formatCurrency(totalStats.totalPremium)}</div>}
            </CardContent>
          </Card>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search branches by name, code, location, manager..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoadingBranches}
          />
        </div>
        
        {/* Error Loading Branches */}
        {isErrorBranches && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Branches</AlertTitle>
            <AlertDescription>
              {errorBranches?.message || 'An unexpected error occurred.'} Please try refreshing.
            </AlertDescription>
          </Alert>
        )}

        {/* Branch Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Policies</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBranches ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}><Skeleton className="h-8 w-full" /></TableCell> 
                </TableRow>
                ))
              ) : filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center"> 
                    No branches found{searchTerm ? ' matching your search' : ''}.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.branch_code}</TableCell>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>{branch.user_details?.first_name} {branch.user_details?.last_name || 'N/A'}</TableCell>
                    <TableCell>{branch.total_agents || 0}</TableCell>
                    <TableCell>{branch.total_policies || 0}</TableCell>
                    <TableCell>{formatCurrency(branch.total_premium || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={branch.user_details?.is_active ? "default" : "outline"}>
                        {branch.user_details?.is_active ? 'Active' : 'Inactive'} {/* Assuming status based on manager */}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewClick(branch)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <PermissionGate permission="manage_branches">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(branch)}
                            title="Edit Branch"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(branch)}
                            title="Delete Branch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </PermissionGate>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* --- Dialogs --- */}
      
      {/* Add Branch Dialog */}
      <Dialog open={isAddBranchOpen} onOpenChange={(open) => { if (!open) resetBranchForm(); setIsAddBranchOpen(open); }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>Enter details for the new branch.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form fields using branchFormData and handleFormChange */}
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input id="name" value={branchFormData.name} onChange={handleFormChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch_code">Branch Code *</Label>
                <Input id="branch_code" type="number" value={branchFormData.branch_code || ''} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={branchFormData.company_name} onChange={handleFormChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={branchFormData.location} onChange={handleFormChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="user">Branch Manager ID (Optional)</Label>
              <Input id="user" type="number" placeholder="Enter User ID" value={branchFormData.user || ''} onChange={handleFormChange} />
               {/* Needs a better way to select user - e.g., dropdown/search */}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdd} disabled={addBranchMutation.isPending}>
              {addBranchMutation.isPending ? 'Saving...' : 'Save Branch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Edit Branch Dialog */}
       <Dialog open={isEditBranchOpen} onOpenChange={(open) => { if (!open) resetBranchForm(); setIsEditBranchOpen(open); }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Branch: {selectedBranch?.name}</DialogTitle>
            <DialogDescription>Update branch details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form fields using branchFormData and handleFormChange */}
             <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input id="name" value={branchFormData.name} onChange={handleFormChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch_code">Branch Code *</Label>
                <Input id="branch_code" type="number" value={branchFormData.branch_code || ''} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={branchFormData.company_name} onChange={handleFormChange} required />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={branchFormData.location} onChange={handleFormChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="user">Branch Manager ID (Optional)</Label>
              <Input id="user" type="number" placeholder="Enter User ID" value={branchFormData.user || ''} onChange={handleFormChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBranchOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpdate} disabled={updateBranchMutation.isPending}>
               {updateBranchMutation.isPending ? 'Saving...' : 'Update Branch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Branch Dialog */}
      {selectedBranch && (
        <Dialog open={isViewBranchOpen} onOpenChange={setIsViewBranchOpen}>
          <DialogContent className="max-w-3xl"> {/* Wider dialog */}
            <DialogHeader>
              <DialogTitle>{selectedBranch.name}</DialogTitle>
              <DialogDescription>
                Branch Code: {selectedBranch.branch_code} | Location: {selectedBranch.location}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 pt-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {isLoadingBranches ? (
                     [...Array(4)].map((_,i) => <Skeleton key={i} className="h-24 w-full" />)
                   ) : (
                      <>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Customers</CardTitle></CardHeader>
                          <CardContent><div className="text-2xl font-bold">{selectedBranch.total_policies || 0}</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Policies</CardTitle></CardHeader>
                          <CardContent><div className="text-2xl font-bold">{selectedBranch.total_policies || 0}</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Agents</CardTitle></CardHeader>
                          <CardContent><div className="text-2xl font-bold">{selectedBranch.total_agents || 0}</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Premium</CardTitle></CardHeader>
                          <CardContent><div className="text-2xl font-bold">{formatCurrency(selectedBranch.total_premium || 0)}</div></CardContent>
                        </Card>
                      </>
                   )}
                </div>
                 {/* Add more overview details if needed */}
              </TabsContent>
              
              {/* Staff Tab */}
              <TabsContent value="staff" className="pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users size={16} /> Branch Manager
                  </h3>
                  {selectedBranch.user_details ? (
                     <Card><CardContent className="p-4 grid grid-cols-2 gap-2 text-sm">
                       <div><span className="text-muted-foreground">Name:</span> {selectedBranch.user_details.first_name} {selectedBranch.user_details.last_name}</div>
                       <div><span className="text-muted-foreground">Status:</span> <Badge variant={selectedBranch.user_details.is_active ? "default" : "outline"}>{selectedBranch.user_details.is_active ? "Active" : "Inactive"}</Badge></div>
                       {selectedBranch.user_details.email && <div><span className="text-muted-foreground">Email:</span> {selectedBranch.user_details.email}</div>}
                       {selectedBranch.user_details.phone && <div><span className="text-muted-foreground">Phone:</span> {selectedBranch.user_details.phone}</div>}
                     </CardContent></Card>
                  ) : <p className="text-muted-foreground text-sm">No manager assigned.</p>}
                  
                  <h3 className="font-medium flex items-center gap-2 mt-6">
                    <Users size={16} /> Branch Agents ({viewAgents.length})
                  </h3>
                   <div className="rounded-md border max-h-60 overflow-y-auto">
                     {isLoadingViewAgents ? <Skeleton className="h-32 w-full" /> : viewAgents.length === 0 ? (
                       <p className="p-4 text-center text-muted-foreground">No agents found for this branch.</p>
                     ) : (
                       <Table>
                         <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Status</TableHead><TableHead>Policies</TableHead></TableRow></TableHeader>
                         <TableBody>
                           {viewAgents.map(agent => (
                             <TableRow key={agent.id}>
                               <TableCell>{agent.agent_name}</TableCell>
                               <TableCell>{agent.agent_code}</TableCell>
                               <TableCell><Badge variant={agent.status === 'ACTIVE' ? 'default' : 'outline'}>{agent.status}</Badge></TableCell>
                               <TableCell>{agent.total_policies_sold}</TableCell>
                              </TableRow>
                           ))}
                         </TableBody>
                       </Table>
                     )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports" className="pt-4">
                 <h3 className="font-medium mb-4">Agent Reports ({viewAgentReports.length})</h3>
                  <div className="rounded-md border max-h-80 overflow-y-auto">
                    {isLoadingViewAgentReports ? <Skeleton className="h-48 w-full" /> : viewAgentReports.length === 0 ? (
                       <p className="p-4 text-center text-muted-foreground">No agent reports found for this branch.</p>
                     ) : (
                       <Table>
                          <TableHeader><TableRow><TableHead>Agent</TableHead><TableHead>Period</TableHead><TableHead>Policies Sold</TableHead><TableHead>Premium</TableHead><TableHead>Commission</TableHead></TableRow></TableHeader>
                         <TableBody>
                            {viewAgentReports.map(report => (
                             <TableRow key={report.id}>
                               <TableCell>{report.agent_name}</TableCell>
                               <TableCell>{report.reporting_period}</TableCell>
                               <TableCell>{report.policies_sold}</TableCell>
                               <TableCell>{formatCurrency(parseFloat(report.total_premium))}</TableCell>
                               <TableCell>{formatCurrency(parseFloat(report.commission_earned))}</TableCell>
                              </TableRow>
                           ))}
                         </TableBody>
                       </Table>
                     )}
                  </div>
                 {/* Add more charts/data here later */}
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsViewBranchOpen(false)}>Close</Button>
              <PermissionGate permission="manage_branches">
                <Button onClick={() => { setIsViewBranchOpen(false); handleEditClick(selectedBranch); }}>
                  <Edit size={16} className="mr-2" /> Edit Branch
              </Button>
              </PermissionGate>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteBranchOpen} onOpenChange={setIsDeleteBranchOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the branch "{selectedBranch?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteBranchOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteBranchMutation.isPending}>
              {deleteBranchMutation.isPending ? 'Deleting...' : 'Delete Branch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default BranchManagement;
