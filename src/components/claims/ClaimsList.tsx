import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Eye, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClaimDetailsDialog } from './ClaimDetailsDialog';
import { mockClaims } from '@/utils/data';
import { formatDate, formatCurrency } from '@/lib/utils';

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

interface ClaimsListProps {
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  canEdit: boolean;
}

export const ClaimsList = ({ status, canEdit }: ClaimsListProps) => {
  const { toast } = useToast();
  const [selectedClaim, setSelectedClaim] = React.useState<Claim | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  
  // Mock data based on data.json
  const claims: Claim[] = [
    {
      id: 2,
      policy_holder_number: "1751451440001",
      customer_name: "Nur Pratap Karki",
      branch_name: "Kohalpur Branch",
      claim_date: "2025-04-30",
      status: "Pending",
      reason: "Death",
      other_reason: "",
      documents: null,
      claim_amount: "5000000.00",
      policy_holder: 1,
      branch: 1
    }
  ];
  
  // Filter claims by status
  const filteredClaims = claims.filter(claim => claim.status.toLowerCase() === status.toLowerCase());
  
  const handleStatusChange = (claimId: number, newStatus: string) => {
    toast({
      title: `Claim #${claimId} status updated`,
      description: `Status has been changed to ${newStatus}`,
    });
  };
  
  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setDetailsOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Policy Number</TableHead>
                <TableHead>Policy Holder</TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Filed</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No claims found with {status} status.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.policy_holder_number}</TableCell>
                    <TableCell>{claim.customer_name}</TableCell>
                    <TableCell>{claim.reason}</TableCell>
                    <TableCell>{formatCurrency(Number(claim.claim_amount))}</TableCell>
                    <TableCell>{formatDate(claim.claim_date)}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewClaim(claim)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {canEdit && status === 'pending' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusChange(claim.id, 'approved')}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusChange(claim.id, 'rejected')}>
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        
                        {canEdit && status !== 'pending' && (
                          <Button variant="ghost" size="sm" onClick={() => handleViewClaim(claim)}>
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
        </CardContent>
      </Card>
      
      {selectedClaim && (
        <ClaimDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          claim={selectedClaim}
          canEdit={canEdit}
        />
      )}
    </>
  );
};
