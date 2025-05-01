
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AgentApplicationDetailsProps {
  application: any;
}

export const AgentApplicationDetails = ({ application }: AgentApplicationDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
          <p className="text-base">{application.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Application Status</h3>
          <div className="mt-1">
            <Badge 
              variant={
                application.status === 'pending' ? "default" : 
                application.status === 'approved' ? "outline" : "destructive"
              }
              className={application.status === 'approved' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
            >
              {application.status === 'pending' ? 'Pending' : 
               application.status === 'approved' ? 'Approved' : 'Rejected'}
            </Badge>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
          <p className="text-base">{application.email}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
          <p className="text-base">{application.phone}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
          <p className="text-base">{application.branchName}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Application Date</h3>
          <p className="text-base">{new Date(application.applicationDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Educational Background</h3>
              <p className="text-base">{application.education}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
              <p className="text-base">{application.experience}</p>
            </div>
            
            {application.rejectionReason && (
              <div>
                <h3 className="text-sm font-medium text-destructive">Rejection Reason</h3>
                <p className="text-base">{application.rejectionReason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">ID Proof</p>
                <p className="text-sm text-muted-foreground">citizenship.pdf</p>
              </div>
              <Badge>View</Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Resume</p>
                <p className="text-sm text-muted-foreground">resume.pdf</p>
              </div>
              <Badge>View</Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Training Certificate</p>
                <p className="text-sm text-muted-foreground">certificate.pdf</p>
              </div>
              <Badge>View</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
