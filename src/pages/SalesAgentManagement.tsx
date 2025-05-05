import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePermissions } from '@/contexts/PermissionsContext';
import { AgentPerformanceChart } from '@/components/reports/charts/AgentPerformanceChart';
import { AgentApplicationList } from '@/components/agent/AgentApplicationList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getAgents } from '@/api/endpoints';
import { SalesAgent } from '@/types';

// Define interface based on data.json agent_reports
interface AgentReport {
  id: number;
  agent_name: string;
  branch_name: string;
  report_date: string;
  reporting_period: string;
  policies_sold: number;
  total_premium: string;
  commission_earned: string;
  target_achievement: string;
  renewal_rate: string;
  customer_retention: string;
  agent: number;
  branch: number;
}

const SalesAgentManagement: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [agentListTab, setAgentListTab] = useState('active');
  const [mainTab, setMainTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState<SalesAgent | null>(null);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [editingAgent, setEditingAgent] = useState<SalesAgent | null>(null);
  const [commissionRate, setCommissionRate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [agents, setAgents] = useState<SalesAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const issuperadmin = user?.role === 'superadmin';
  const isBranchAdmin = user?.role === 'branch';
  const branchId = user?.role === 'branch' ? Number(user?.branch) : undefined;
  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await getAgents();
        if (response.success && response.data) {
          setAgents(response.data);
        } else {
          setError(response.message || 'Failed to fetch agents');
        }
      } catch (err) {
        setError('An error occurred while fetching agents');
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);
  
  const agentReports: AgentReport[] = [
    {
      id: 5,
      agent_name: "Nur Pratap Karki",
      branch_name: "Kohalpur Branch",
      report_date: "2025-04-01",
      reporting_period: "2025-4",
      policies_sold: 1,
      total_premium: "393125.00",
      commission_earned: "52031.25",
      target_achievement: "0.00",
      renewal_rate: "0.00",
      customer_retention: "0.00",
      agent: 1,
      branch: 1
    }
  ];
  
  const filteredAgents = agents.filter(agent => {
    // Filter by branch for branch admins
    if (isBranchAdmin && branchId && agent.branch !== branchId) {
      return false;
    }
    
    if (agentListTab === 'active' && !agent.is_active) {
      return false;
    }
    
    if (agentListTab === 'inactive' && agent.is_active) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        agent.agent_name.toLowerCase().includes(searchLower) ||
        agent.agent_code.toLowerCase().includes(searchLower) ||
        agent.branch_name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const handleViewAgent = (agent: SalesAgent) => {
    setSelectedAgent(agent);
  };
  
  const handleEditAgent = (agent: SalesAgent) => {
    setEditingAgent(agent);
    setCommissionRate(agent.commission_rate);
    setIsActive(agent.is_active);
  };
  
  const handleUpdateAgent = () => {
    // In a real implementation, this would update the agent in the database
    console.log('Updating agent:', editingAgent?.id, {
      commission_rate: commissionRate,
      is_active: isActive
    });
    
    // Close dialog and reset state
    setEditingAgent(null);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Agent Management</h1>
        </div>
        
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="applications">Agent Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agents" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agents.filter(a => a.is_active).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(parseFloat(agentReports[0]?.commission_earned || "0"))}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Policies Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agents.reduce((acc, agent) => acc + agent.total_policies_sold, 0)}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs value={agentListTab} onValueChange={setAgentListTab}>
              <TabsList>
                <TabsTrigger value="active">Active Agents</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Agents</TabsTrigger>
                <TabsTrigger value="all">All Agents</TabsTrigger>
              </TabsList>
              <TabsContent value={agentListTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Commission Rate</TableHead>
                        <TableHead>Policies Sold</TableHead>
                        <TableHead>Premium Collected</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No agents found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAgents.map((agent) => (
                          <TableRow key={agent.id}>
                            <TableCell className="font-medium">{agent.agent_code}</TableCell>
                            <TableCell>{agent.agent_name}</TableCell>
                            <TableCell>{agent.branch_name}</TableCell>
                            <TableCell>{agent.commission_rate}%</TableCell>
                            <TableCell>{agent.total_policies_sold}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(agent.total_premium_collected))}</TableCell>
                            <TableCell>
                              <Badge variant={agent.is_active ? "default" : "secondary"}>
                                {agent.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewAgent(agent)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {hasPermission('manage_agents') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAgent(agent)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
            
            {selectedAgent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedAgent.agent_name}</CardTitle>
                    <div className="text-sm text-muted-foreground">{selectedAgent.agent_code}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Branch</p>
                        <p className="text-base font-medium">{selectedAgent.branch_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={selectedAgent.is_active ? "default" : "secondary"}>
                          {selectedAgent.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Joining Date</p>
                        <p className="text-base font-medium">{formatDate(selectedAgent.joining_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="text-base font-medium">{selectedAgent.commission_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Policies Sold</p>
                        <p className="text-base font-medium">{selectedAgent.total_policies_sold}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Premium Collected</p>
                        <p className="text-base font-medium">{formatCurrency(parseFloat(selectedAgent.total_premium_collected))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Policy Date</p>
                        <p className="text-base font-medium">{formatDate(selectedAgent.last_policy_date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="chart">
                      <TabsList className="mb-4">
                        <TabsTrigger value="chart">Performance Chart</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="chart">
                        <div className="h-[240px]">
                          <AgentPerformanceChart 
                            branchId={selectedAgent.branch} 
                            timeRange={timeRange} 
                            agentId={selectedAgent.id} 
                          />
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Tabs value={timeRange} onValueChange={(val: any) => setTimeRange(val)} className="w-auto">
                            <TabsList>
                              <TabsTrigger value="weekly">Weekly</TabsTrigger>
                              <TabsTrigger value="monthly">Monthly</TabsTrigger>
                              <TabsTrigger value="yearly">Yearly</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="reports">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Period</TableHead>
                              <TableHead>Policies Sold</TableHead>
                              <TableHead>Premium</TableHead>
                              <TableHead>Commission</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {agentReports
                              .filter(report => report.agent === selectedAgent.id)
                              .map(report => (
                                <TableRow key={report.id}>
                                  <TableCell>{report.reporting_period}</TableCell>
                                  <TableCell>{report.policies_sold}</TableCell>
                                  <TableCell>{formatCurrency(parseFloat(report.total_premium))}</TableCell>
                                  <TableCell>{formatCurrency(parseFloat(report.commission_earned))}</TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Edit Agent Dialog */}
            <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Agent: {editingAgent?.agent_name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input
                      id="commission-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active-status"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="active-status">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingAgent(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateAgent}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="applications" className="py-2">
            <AgentApplicationList 
              issuperadmin={issuperadmin} 
              branchId={branchId} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SalesAgentManagement; 