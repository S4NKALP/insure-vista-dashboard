import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getClaimRequests } from '@/api/endpoints'; // Use endpoint export
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClaimRequest } from '@/types'; // Import ClaimRequest type if defined globally
import { Badge } from '@/components/ui/badge';

// Simplified interface for the table
interface TableClaim {
  id: number;
  claimId: string;
  policyNumber: string;
  customerName: string;
  branchName: string;
  reason: string;
  amount: string; // Keep as string to match API potential response
  status: string;
}

// Function to fetch and process claim data
const fetchRecentClaims = async (): Promise<TableClaim[]> => {
  console.log('Fetching recent claims...');
  const response = await getClaimRequests();
  console.log('RecentClaims API response:', response);

  if (response.success && response.data) {
    // Map the API response (assuming it's ClaimRequest[]) to our TableClaim interface
    const mappedClaims = response.data
      .map((claim: ClaimRequest): TableClaim => ({
        id: claim.id,
        claimId: claim.id.toString(), // Assuming claimId is just the numeric ID
        policyNumber: claim.policy_holder_number,
        customerName: claim.customer_name,
        branchName: claim.branch_name,
        reason: claim.reason || 'Not specified',
        amount: claim.claim_amount || '0',
        status: claim.status
      }))
      // Sort by newest first (assuming higher ID means newer)
      .sort((a, b) => b.id - a.id)
      // Take only the first 5
      .slice(0, 5);

    return mappedClaims;
  } else {
    throw new Error(response.message || 'Failed to fetch recent claims');
  }
};

export const RecentClaimsTable = () => {
  const { 
    data: claims = [], // Default to empty array
    isLoading, 
    isError, 
    error 
  } = useQuery<TableClaim[], Error>({
    queryKey: ['recentClaims'],
    queryFn: fetchRecentClaims,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Claims</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Recent Claims</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred.'}
            </AlertDescription>
          </Alert>
        ) : claims.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent claims found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Policy #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claimId}</TableCell>
                  <TableCell>{claim.policyNumber}</TableCell>
                  <TableCell>{claim.customerName}</TableCell>
                  <TableCell>{claim.branchName}</TableCell>
                  <TableCell>{claim.reason}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(claim.amount))}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(claim.status)}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
