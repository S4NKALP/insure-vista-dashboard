
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
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
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import sampleData from '@/utils/data';

const BranchManagement = () => {
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isViewBranchOpen, setIsViewBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    branch_code: '',
    location: '',
    company: 1 // Default to the first company
  });

  useEffect(() => {
    // Load branches from the sample data
    setBranches(sampleData.branches || []);
    setFilteredBranches(sampleData.branches || []);
  }, []);

  useEffect(() => {
    let filtered = [...branches];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(branch => 
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.branch_code?.toString().includes(searchTerm) ||
        branch.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  const handleAddBranch = () => {
    // Validate form inputs
    if (!newBranch.name || !newBranch.branch_code || !newBranch.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate adding a new branch
    const newBranchId = Math.max(...branches.map(b => b.id), 0) + 1;
    const branchToAdd = {
      ...newBranch,
      id: newBranchId,
      company_name: sampleData.companies?.[0]?.name || 'Easy Life Insurance LTD.'
    };
    
    setBranches([...branches, branchToAdd]);
    setIsAddBranchOpen(false);
    setNewBranch({
      name: '',
      branch_code: '',
      location: '',
      company: 1
    });
    
    toast.success("Branch added successfully");
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setIsViewBranchOpen(true);
  };

  const getBranchStats = (branchId) => {
    const customers = sampleData.customers?.filter(c => 
      sampleData.policy_holders?.some(p => p.branch?.id === branchId && p.customer?.id === c.id)
    ) || [];
    
    const policies = sampleData.policy_holders?.filter(p => p.branch?.id === branchId) || [];
    
    const agents = sampleData.sales_agents?.filter(a => a.branch === branchId) || [];
    
    const totalPremium = policies.reduce((total, policy) => {
      // Since we don't have premium_payments in our simplified data, we'll use a placeholder calculation
      return total + (parseFloat(policy.sum_assured) * 0.05); // 5% of sum assured as premium
    }, 0);
    
    return {
      customerCount: customers.length,
      policyCount: policies.length,
      agentCount: agents.length,
      totalPremium: totalPremium
    };
  };

  return (
    <DashboardLayout title="Branch Management">
      <div className="space-y-6">
        {/* Header with search and add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            <Input 
              placeholder="Search branches..." 
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddBranchOpen(true)}
          >
            <Plus size={16} />
            <span>Add New Branch</span>
          </Button>
        </div>
        
        {/* Branch list table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>List of all branches in the system</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Branch Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Branch Manager</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => {
                  const manager = branch.user_details ? 
                    `${branch.user_details.first_name || ''} ${branch.user_details.last_name || ''}` : 
                    'Not Assigned';
                  
                  return (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.id}</TableCell>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>{branch.branch_code}</TableCell>
                      <TableCell>{branch.location}</TableCell>
                      <TableCell>{branch.company_name}</TableCell>
                      <TableCell>{manager}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewBranch(branch)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No branches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
                  onChange={(e) => setNewBranch({...newBranch, branch_code: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input 
                  id="company" 
                  value={sampleData.companies?.[0]?.name || 'Easy Life Insurance LTD.'}
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
                  
                  {selectedBranch.user_details ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Name</h4>
                          <p>{selectedBranch.user_details.first_name} {selectedBranch.user_details.last_name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p>{selectedBranch.user_details.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Username</h4>
                          <p>{selectedBranch.user_details.username}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <Badge variant={selectedBranch.user_details.is_active ? "default" : "outline"}>
                            {selectedBranch.user_details.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex items-center justify-between">
                      <span>No branch manager assigned to this branch.</span>
                      <Button size="sm">Assign Manager</Button>
                    </div>
                  )}
                  
                  <h3 className="font-medium flex items-center gap-2 mt-6">
                    <Users size={16} />
                    Branch Agents
                  </h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent Name</TableHead>
                        <TableHead>Agent Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Policies Sold</TableHead>
                        <TableHead>Commission Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.sales_agents?.filter(agent => agent.branch === selectedBranch.id).map(agent => (
                        <TableRow key={agent.id}>
                          <TableCell>{agent.agent_name}</TableCell>
                          <TableCell>{agent.agent_code}</TableCell>
                          <TableCell>
                            <Badge variant={agent.status === 'ACTIVE' ? "default" : "outline"}>
                              {agent.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{agent.total_policies_sold}</TableCell>
                          <TableCell>{agent.commission_rate}%</TableCell>
                        </TableRow>
                      ))}
                      {(sampleData.sales_agents?.filter(agent => agent.branch === selectedBranch.id).length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No agents found for this branch.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Reporting Period</TableHead>
                        <TableHead>Policies Sold</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.agent_reports?.filter(report => report.branch === selectedBranch.id).map(report => (
                        <TableRow key={report.id}>
                          <TableCell>{report.agent_name}</TableCell>
                          <TableCell>{report.reporting_period}</TableCell>
                          <TableCell>{report.policies_sold}</TableCell>
                          <TableCell>Rs. {parseFloat(report.total_premium).toLocaleString()}</TableCell>
                          <TableCell>Rs. {parseFloat(report.commission_earned).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {(sampleData.agent_reports?.filter(report => report.branch === selectedBranch.id).length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No agent reports found for this branch.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
