import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the claim interface based on data.json
interface Claim {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  branch_name: string;
  claim_date: string;
  status: string;
  reason: string;
  other_reason: string;
  documents: string | null;
  claim_amount: string;
  policy_holder: number;
  branch: number;
}

interface ClaimDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: Claim;
  canEdit: boolean;
}

export const ClaimDetailsDialog = ({ 
  open, 
  onOpenChange, 
  claim, 
  canEdit 
}: ClaimDetailsDialogProps) => {
  const { toast } = useToast();
  const [status, setStatus] = React.useState(claim.status);
  
  const handleUpdateStatus = () => {
    toast({
      title: "Claim status updated",
      description: `Status has been changed to ${status}`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Claim #{claim.id}</DialogTitle>
          <DialogDescription>
            Filed on {formatDate(claim.claim_date)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Claim Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Policy Holder</h3>
                <p className="text-base">{claim.customer_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Policy Number</h3>
                <p className="text-base">{claim.policy_holder_number}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
                <p className="text-base">{claim.branch_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge 
                  variant={
                    claim.status === 'Pending' ? "default" : 
                    claim.status === 'Approved' ? "outline" : 
                    claim.status === 'Processing' ? "secondary" : "destructive"
                  }
                  className={claim.status === 'Approved' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {claim.status}
                </Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Claim Type</h3>
                <p className="text-base">{claim.reason}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Claim Amount</h3>
                <p className="text-base font-semibold">{formatCurrency(parseFloat(claim.claim_amount))}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">
                  {claim.other_reason || "Policy holder claimed benefits due to " + claim.reason.toLowerCase() + " event that occurred on " + formatDate(claim.claim_date)}
                </p>
              </div>
              
              {claim.documents && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Documents</h3>
                  <p className="text-base">{claim.documents}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Death Certificate</p>
                    <p className="text-sm text-muted-foreground">certificate.pdf</p>
                  </div>
                  <Badge className="cursor-pointer">View</Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Medical Report</p>
                    <p className="text-sm text-muted-foreground">medical_report.pdf</p>
                  </div>
                  <Badge className="cursor-pointer">View</Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">ID Proof</p>
                    <p className="text-sm text-muted-foreground">id_proof.pdf</p>
                  </div>
                  <Badge className="cursor-pointer">View</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <div className="border rounded-md p-4 flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">CS</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Created by Claim Specialist</p>
                  <p className="text-sm text-muted-foreground">{formatDate(claim.claim_date)}</p>
                  <p>Claim registered in the system with initial supporting documents.</p>
                </div>
              </div>
              
              <div className="border rounded-md p-4 flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-sm font-semibold">UW</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Reviewed by Underwriter</p>
                  <p className="text-sm text-muted-foreground">{formatDate(claim.claim_date)}</p>
                  <p>Initial documents verified and sent for further investigation.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          {canEdit && (
            <div className="flex items-center space-x-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleUpdateStatus}>Update Status</Button>
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
