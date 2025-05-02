import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import {
  Table,
  TableBody,
  TableCaption,
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
  ChartBar,
  Eye,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  DollarSign
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from '@/lib/utils';
import { Branch, ApiResponse } from '@/types';
import { 
  getBranches, 
  getBranchById, 
  addBranch, 
  getAgentsByBranch, 
  getPolicyHoldersByBranch,
  getAgentReportsByBranch
} from '@/api/endpoints';

// Extended branch type for UI purposes with calculated stats
interface ExtendedBranch extends Branch {
  total_policies: number;
  total_premium: string;
  total_claims: number;
  total_agents: number;
  status: string;
}

const BranchManagement = () => {
  const { user } = useAuth();
  const { isSuperAdmin, userBranchId } = usePermissions();
  const [branches, setBranches] = useState<ExtendedBranch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<ExtendedBranch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isViewBranchOpen, setIsViewBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<ExtendedBranch | null>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    branch_code: '',
    location: '',
    company: 1 // Default to the first company
  });
  const [isLoading, setIsLoading] = useState(true);
  const [branchStats, setBranchStats] = useState<{
    [key: number]: { 
      customerCount: number; 
      policyCount: number; 
      agentCount: number; 
      totalPremium: number;
    }
  }>({});

  useEffect(() => {
    // Fetch branches from API
    const fetchBranches = async () => {
      setIsLoading(true);
      try {
        const response = await getBranches();
        if (response.success) {
          // Map branches to include additional stats calculated on the UI side
          let branchesToProcess = response.data;
          
          // If not a superadmin, filter branches to only show the user's branch
          if (!isSuperAdmin && userBranchId) {
            branchesToProcess = branchesToProcess.filter(
              branch => branch.id.toString() === userBranchId
            );
          }
          
          const extendedBranches = await Promise.all(
            branchesToProcess.map(async branch => {
              // Get policy holders, agents, and other data for this branch
              const policyHoldersResponse = await getPolicyHoldersByBranch(branch.id);
              const agentsResponse = await getAgentsByBranch(branch.id);
              
              // Calculate total premium
              const policyHolders = policyHoldersResponse.success ? policyHoldersResponse.data : [];
              const totalPremium = policyHolders.reduce((sum, policy) => {
                return sum + parseFloat(policy.sum_assured) * 0.05; // Estimated premium of 5% of sum assured
              }, 0);
              
              // Return extended branch with stats
              return {
                ...branch,
                total_policies: policyHolders.length,
                total_premium: totalPremium.toFixed(2),
                total_claims: 0, // This could be fetched from a claims API
                total_agents: agentsResponse.success ? agentsResponse.data.length : 0,
                status: 'ACTIVE' // Default status for all branches
              };
            })
          );
          
          setBranches(extendedBranches);
          setFilteredBranches(extendedBranches);
        } else {
          toast.error("Failed to load branches");
        }
      } catch (error) {
        console.error("Error loading branches:", error);
        toast.error("An error occurred while loading branches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [isSuperAdmin, userBranchId]);

  useEffect(() => {
    let filtered = [...branches];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(branch => 
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(branch.branch_code)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.user_details?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  const handleAddBranch = async () => {
    // Validate form inputs
    if (!newBranch.name || !newBranch.branch_code || !newBranch.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Create branch object to send to API
      const branchToAdd = {
        name: newBranch.name,
        branch_code: parseInt(newBranch.branch_code),
        location: newBranch.location,
        company: newBranch.company,
        company_name: "Easy Life Insurance LTD." // This would come from company API
      };
      
      // Call API to add branch
      const response = await addBranch(branchToAdd);
      
      if (response.success) {
        // Add the returned branch (with id) to the branches list
        const newBranchWithStats: ExtendedBranch = {
          ...response.data,
          total_policies: 0,
          total_premium: '0.00',
          total_claims: 0,
          total_agents: 0,
          status: 'ACTIVE'
        };
        
        setBranches([...branches, newBranchWithStats]);
        setIsAddBranchOpen(false);
        setNewBranch({
          name: '',
          branch_code: '',
          location: '',
          company: 1
        });
        
        toast.success("Branch added successfully");
      } else {
        toast.error(response.message || "Failed to add branch");
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      toast.error("An error occurred while adding the branch");
    }
  };

  const handleViewBranch = async (branch: ExtendedBranch) => {
    setSelectedBranch(branch);
    setIsViewBranchOpen(true);
    
    // Fetch detailed stats for this branch if we don't have them yet
    if (!branchStats[branch.id]) {
      try {
        // Fetch policy holders for this branch
        const policyHoldersResponse = await getPolicyHoldersByBranch(branch.id);
        
        // Fetch agents for this branch
        const agentsResponse = await getAgentsByBranch(branch.id);
        
        // Collect customer IDs from policy holders
        const customers = new Set();
        const policyHolders = policyHoldersResponse.success ? policyHoldersResponse.data : [];
        policyHolders.forEach(policy => {
          if (policy.customer?.id) {
            customers.add(policy.customer.id);
          }
        });
        
        // Calculate premium
        const totalPremium = policyHolders.reduce((total, policy) => {
          return total + parseFloat(policy.sum_assured) * 0.05; // Estimated premium
        }, 0);
        
        // Store stats for this branch
        setBranchStats({
          ...branchStats,
          [branch.id]: {
            customerCount: customers.size,
            policyCount: policyHolders.length,
            agentCount: agentsResponse.success ? agentsResponse.data.length : 0,
            totalPremium
          }
        });
        
        // Get agent reports to display in the UI
        const reportsResponse = await getAgentReportsByBranch(branch.id);
        
        // Populate the agents table once the view is opened
        setTimeout(() => {
          const agentsContainer = document.getElementById('agents-table-container');
          if (agentsContainer && agentsResponse.success) {
            const agents = agentsResponse.data;
            
            if (agents.length === 0) {
              agentsContainer.innerHTML = `
                <div class="py-8 text-center text-gray-500">
                  No agents found for this branch.
                </div>
              `;
            } else {
              agentsContainer.innerHTML = `
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2 font-medium">Agent Name</th>
                      <th class="text-left py-2 font-medium">Agent Code</th>
                      <th class="text-left py-2 font-medium">Status</th>
                      <th class="text-left py-2 font-medium">Policies Sold</th>
                      <th class="text-left py-2 font-medium">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${agents.map(agent => `
                      <tr class="border-b">
                        <td class="py-2">${agent.agent_name}</td>
                        <td class="py-2">${agent.agent_code}</td>
                        <td class="py-2">
                          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            agent.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }">
                            ${agent.status}
                          </span>
                        </td>
                        <td class="py-2">${agent.total_policies_sold}</td>
                        <td class="py-2">${agent.commission_rate}%</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;
            }
          }
          
          // Populate the agent reports table
          const reportsContainer = document.getElementById('agent-reports-container');
          if (reportsContainer) {
            const reports = reportsResponse.success ? reportsResponse.data : [];
            
            if (reports.length === 0) {
              reportsContainer.innerHTML = `
                <div class="py-8 text-center text-gray-500">
                  No agent reports found for this branch.
                </div>
              `;
            } else {
              reportsContainer.innerHTML = `
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2 font-medium">Agent</th>
                      <th class="text-left py-2 font-medium">Reporting Period</th>
                      <th class="text-left py-2 font-medium">Policies Sold</th>
                      <th class="text-left py-2 font-medium">Premium</th>
                      <th class="text-left py-2 font-medium">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reports.map(report => `
                      <tr class="border-b">
                        <td class="py-2">${report.agent_name}</td>
                        <td class="py-2">${report.reporting_period}</td>
                        <td class="py-2">${report.policies_sold}</td>
                        <td class="py-2">Rs. ${parseFloat(report.total_premium).toLocaleString()}</td>
                        <td class="py-2">Rs. ${parseFloat(report.commission_earned).toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;
            }
          }
        }, 100); // Small delay to ensure the DOM elements exist
      } catch (error) {
        console.error("Error fetching branch details:", error);
      }
    }
  };

  const getBranchStats = (branchId: number) => {
    // Return cached stats if available
    if (branchStats[branchId]) {
      return branchStats[branchId];
    }
    
    // Return default stats
    return {
      customerCount: 0,
      policyCount: 0,
      agentCount: 0,
      totalPremium: 0
    };
  };

  return (
    <DashboardLayout title="Branch Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <PermissionGate permission="manage_branches">
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsAddBranchOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Branch
            </Button>
          </PermissionGate>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branches.reduce((acc, branch) => acc + branch.total_agents, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branches.reduce((acc, branch) => acc + branch.total_policies, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  branches.reduce((acc, branch) => acc + parseFloat(branch.total_premium), 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search branches..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Loading branches...
                  </TableCell>
                </TableRow>
              ) : filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No branches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.branch_code}</TableCell>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>{branch.user_details?.first_name} {branch.user_details?.last_name}</TableCell>
                    <TableCell>{branch.total_agents}</TableCell>
                    <TableCell>{branch.total_policies}</TableCell>
                    <TableCell>{formatCurrency(parseFloat(branch.total_premium))}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {branch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBranch(branch)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <PermissionGate permission="manage_branches">
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
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
        
        {selectedBranch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedBranch.name}</CardTitle>
                <div className="text-sm text-muted-foreground">Branch Code: {selectedBranch.branch_code}</div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Branch Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedBranch.location}</span>
                    </div>
                    {selectedBranch.user_details?.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedBranch.user_details.email}</span>
                      </div>
                    )}
                    {selectedBranch.user_details?.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedBranch.user_details.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Branch Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Manager</p>
                      <p className="font-medium">
                        {selectedBranch.user_details ? 
                          `${selectedBranch.user_details.first_name} ${selectedBranch.user_details.last_name}` : 
                          'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{selectedBranch.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="default">
                        {selectedBranch.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Branch Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBranch.total_agents}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBranch.total_policies}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBranch.total_claims}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(parseFloat(selectedBranch.total_premium))}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  {isSuperAdmin && (
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Branch Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Add Branch Dialog */}
      <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Enter the details for the new branch. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input 
                id="name" 
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch_code">Branch Code *</Label>
                <Input 
                  id="branch_code" 
                  value={newBranch.branch_code}
                  type="number"
                  onChange={(e) => setNewBranch({...newBranch, branch_code: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input 
                  id="company" 
                  value="Easy Life Insurance LTD."
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location"
                value={newBranch.location}
                onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBranch}>Save Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Branch Dialog */}
      {selectedBranch && (
        <Dialog open={isViewBranchOpen} onOpenChange={setIsViewBranchOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Branch Details</DialogTitle>
              <DialogDescription>
                Viewing details for {selectedBranch.name}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Branch ID</h3>
                      <p>{selectedBranch.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Branch Code</h3>
                      <p>{selectedBranch.branch_code}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p>{selectedBranch.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Company</h3>
                      <p>{selectedBranch.company_name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(() => {
                    const stats = getBranchStats(selectedBranch.id);
                    return (
                      <>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.customerCount}</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Policies</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.policyCount}</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Agents</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.agentCount}</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Premium Collected</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">Rs. {stats.totalPremium.toLocaleString()}</div>
                          </CardContent>
                        </Card>
                      </>
                    );
                  })()}
                </div>
              </TabsContent>
              
              {/* Staff Tab */}
              <TabsContent value="staff">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users size={16} />
                    Branch Manager
                  </h3>
                  
                  {selectedBranch.user_details && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Name</h4>
                          <p>{selectedBranch.user_details.first_name} {selectedBranch.user_details.last_name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <Badge variant={selectedBranch.user_details.is_active ? "default" : "outline"}>
                            {selectedBranch.user_details.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {selectedBranch.user_details.email && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                            <p>{selectedBranch.user_details.email}</p>
                          </div>
                        )}
                        {selectedBranch.user_details.phone && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                            <p>{selectedBranch.user_details.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <h3 className="font-medium flex items-center gap-2 mt-6">
                    <Users size={16} />
                    Branch Agents
                  </h3>
                  
                  <div id="agents-table-container">
                    {/* This will be dynamically populated with agents data */}
                    Loading agents...
                  </div>
                </div>
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <ChartBar size={16} />
                    Branch Performance
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Premium Collection</CardTitle>
                        <CardDescription>
                          Monthly premium collection for {selectedBranch.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-gray-500">
                          Chart visualization would appear here
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Policy Distribution</CardTitle>
                        <CardDescription>
                          Policy types distribution for {selectedBranch.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-gray-500">
                          Chart visualization would appear here
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="font-medium mt-4">Agent Reports</h3>
                  
                  <div id="agent-reports-container">
                    {/* This will be dynamically populated with agent reports data */}
                    Loading agent reports...
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewBranchOpen(false)}>Close</Button>
              <Button variant="default">
                <Edit size={16} className="mr-2" />
                Edit Branch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default BranchManagement;
