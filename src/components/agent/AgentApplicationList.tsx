
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
  DialogTitle 
} from "@/components/ui/dialog";
import { AgentApplicationDetails } from "@/components/agent/AgentApplicationDetails";

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

interface AgentApplicationListProps {
  isSuperAdmin: boolean;
  branchId?: string;
}

export const AgentApplicationList = ({ isSuperAdmin, branchId }: AgentApplicationListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  // Filter applications based on search term and branch constraints
  const filteredApplications = sampleApplications
    .filter(application => {
      // Filter by branch if not superadmin
      if (branchId) {
        return application.branchId === branchId;
      }
      return true;
    })
    .filter(application => {
      if (!searchTerm) return true;
      
      return (
        application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.phone.includes(searchTerm)
      );
    });
    
  const viewApplicationDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };
  
  const handleApproveApplication = (applicationId: string) => {
    // In a real app, you would call an API to approve the application
    toast({
      title: "Application Approved",
      description: "The agent application has been approved.",
    });
  };
  
  const handleRejectApplication = (applicationId: string) => {
    // In a real app, you would call an API to reject the application
    toast({
      title: "Application Rejected",
      description: "The agent application has been rejected.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Agent Applications</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <TableHead>Experience</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>
                    <div>{application.email}</div>
                    <div className="text-sm text-muted-foreground">{application.phone}</div>
                  </TableCell>
                  {isSuperAdmin && <TableCell>{application.branchName}</TableCell>}
                  <TableCell>
                    <Badge 
                      variant={
                        application.status === 'pending' ? "default" : 
                        application.status === 'approved' ? "success" : "destructive"
                      }
                    >
                      {application.status === 'pending' ? 'Pending' : 
                       application.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </TableCell>
                  <TableCell>{application.experience}</TableCell>
                  <TableCell>{new Date(application.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => viewApplicationDetails(application)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleApproveApplication(application.id)}>
                            <UserCheck className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRejectApplication(application.id)}>
                            <UserX className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && <AgentApplicationDetails application={selectedApplication} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
