
import React, { useState } from 'react';
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
import { Edit, Trash2, UserPlus, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AgentForm } from "@/components/agent/AgentForm";

// Mock data for agents
const sampleAgents = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    phone: '+9779812345678',
    branchId: '1',
    branchName: 'Kathmandu Branch',
    status: 'active',
    commissionRate: 10,
    joiningDate: '2023-05-15',
    policiesSold: 24,
    totalCommission: 235000
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com',
    phone: '+9779887654321',
    branchId: '2',
    branchName: 'Pokhara Branch',
    status: 'active',
    commissionRate: 12,
    joiningDate: '2023-06-20',
    policiesSold: 18,
    totalCommission: 186000
  },
  { 
    id: '3', 
    name: 'Ram Kumar', 
    email: 'ram.kumar@example.com',
    phone: '+9779834567890',
    branchId: '1',
    branchName: 'Kathmandu Branch',
    status: 'inactive',
    commissionRate: 8,
    joiningDate: '2022-12-10',
    policiesSold: 5,
    totalCommission: 40000
  },
];

interface AgentListProps {
  isSuperAdmin: boolean;
  branchId?: string;
}

export const AgentList = ({ isSuperAdmin, branchId }: AgentListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  
  // Filter agents based on search term and branch constraints
  const filteredAgents = sampleAgents
    .filter(agent => {
      // Filter by branch if not superadmin
      if (branchId) {
        return agent.branchId === branchId;
      }
      return true;
    })
    .filter(agent => {
      if (!searchTerm) return true;
      
      return (
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm)
      );
    });
    
  const handleAddAgent = (agentData: any) => {
    toast({
      title: "Success",
      description: "Agent added successfully",
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteAgent = (agentId: string) => {
    // In a real app, you would call an API to delete the agent
    toast({
      title: "Agent Deleted",
      description: "The agent has been removed successfully",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Manage Agents</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
              </DialogHeader>
              <AgentForm 
                initialData={editingAgent} 
                onSubmit={handleAddAgent} 
                isSuperAdmin={isSuperAdmin}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              {isSuperAdmin && <TableHead>Branch</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Policies Sold</TableHead>
              <TableHead>Total Commission</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <div>{agent.email}</div>
                    <div className="text-sm text-muted-foreground">{agent.phone}</div>
                  </TableCell>
                  {isSuperAdmin && <TableCell>{agent.branchName}</TableCell>}
                  <TableCell>
                    <Badge variant={agent.status === 'active' ? "default" : "secondary"}>
                      {agent.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.commissionRate}%</TableCell>
                  <TableCell>{agent.policiesSold}</TableCell>
                  <TableCell>Rs. {agent.totalCommission.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAgent(agent)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAgent(agent.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No agents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
