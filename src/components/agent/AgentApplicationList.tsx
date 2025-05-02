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
import { Eye, Search, UserCheck, UserX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
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

// Mock data for agent applications
const sampleApplications = [
  { 
    id: '1', 
    name: 'Mohan Sharma', 
    email: 'mohan.sharma@example.com',
    phone: '+9779823456789',
    branchId: '1',
    branchName: 'Kathmandu Branch',
    status: 'pending',
    experience: '5 years in insurance',
    education: 'Bachelor of Business Administration',
    applicationDate: '2024-04-25',
  },
  { 
    id: '2', 
    name: 'Sita Poudel', 
    email: 'sita.poudel@example.com',
    phone: '+9779854321678',
    branchId: '2',
    branchName: 'Pokhara Branch',
    status: 'pending',
    experience: '3 years in banking',
    education: 'Master of Business Administration',
    applicationDate: '2024-04-28',
  },
  { 
    id: '3', 
    name: 'Anish Gurung', 
    email: 'anish.gurung@example.com',
    phone: '+9779865432198',
    branchId: '1',
    branchName: 'Kathmandu Branch',
    status: 'rejected',
    experience: '2 years in insurance',
    education: 'Bachelor of Commerce',
    applicationDate: '2024-04-15',
    rejectionReason: 'Insufficient experience in the field'
  },
];

interface AgentApplication {
  id: number;
  branch_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
}

interface AgentApplicationListProps {
  isSuperAdmin: boolean;
  branchId?: number;
}

export function AgentApplicationList({ isSuperAdmin, branchId }: AgentApplicationListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  const handleSubmitApplication = async (data: any) => {
    try {
      // TODO: Implement API call to submit application
      const newApplication = {
        id: applications.length + 1,
        branch_name: branchId ? 'Current Branch' : 'All Branches',
        ...data,
        status: 'Pending',
        created_at: new Date().toISOString().split('T')[0],
      };
      setApplications([...applications, newApplication]);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      // TODO: Implement API call to update status
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewApplicationDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="w-4/5 mx-auto max-h-[80vh] flex flex-col">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agent Applications</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>New Application</Button>
            </DialogTrigger>
            <DialogContent className="w-4/5 max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Agent Application</DialogTitle>
              </DialogHeader>
              <AgentApplicationForm onSubmit={handleSubmitApplication} branchId={branchId} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-1/6">Name</TableHead>
                  <TableHead className="w-1/6">Email</TableHead>
                  <TableHead className="w-1/6">Phone</TableHead>
                  <TableHead className="w-1/6">Branch</TableHead>
                  <TableHead className="w-1/12">Status</TableHead>
                  <TableHead className="w-1/12">Date</TableHead>
                  <TableHead className="w-1/4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium truncate max-w-xs">
                        {`${application.first_name} ${application.last_name}`}
                      </TableCell>
                      <TableCell className="truncate max-w-xs">{application.email}</TableCell>
                      <TableCell>{application.phone_number}</TableCell>
                      <TableCell>{application.branch_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === 'Approved'
                              ? 'default'
                              : application.status === 'Rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.created_at}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewApplicationDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          {application.status === 'Pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(application.id, 'Approved')}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <UserCheck className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(application.id, 'Rejected')}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <UserX className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="w-4/5 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              {selectedApplication && <AgentApplicationDetails application={selectedApplication} />}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}