import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/lib/utils';
import { getPolicyHolders } from '@/api/endpoints'; // Use endpoint export
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PolicyHolder } from '@/types'; // Import PolicyHolder type if defined globally

// Simplified interface for the table
interface TablePolicy {
  id: number;
  policyNumber: string;
  customerName: string;
  policyType: string;
  sumAssured: number;
  status: string;
  paymentStatus: string;
}

// Function to fetch and process policy data
const fetchRecentPolicies = async (): Promise<TablePolicy[]> => {
  console.log('Fetching recent policies...');
  const response = await getPolicyHolders();
  console.log('RecentPolicies API response:', response);

  if (response.success && response.data) {
    // Map the API response (assuming it's PolicyHolder[]) to our TablePolicy interface
    const mappedPolicies = response.data
      .map((policy: PolicyHolder): TablePolicy => ({
        id: policy.id,
        policyNumber: policy.policy_number,
        customerName: policy.customer_name,
        // Safely access nested properties
        policyType: policy.policy?.policy_type || 'Unknown',
        sumAssured: parseFloat(policy.sum_assured || '0'),
        status: policy.status,
        paymentStatus: policy.payment_status
      }))
      // Sort by newest first (assuming higher ID means newer)
      .sort((a, b) => b.id - a.id)
      // Take only the first 5
      .slice(0, 5);

    return mappedPolicies;
  } else {
    throw new Error(response.message || 'Failed to fetch recent policies');
  }
};

export const RecentPoliciesTable = () => {
  const { 
    data: policies = [], // Default to empty array
    isLoading, 
    isError, 
    error 
  } = useQuery<TablePolicy[], Error>({
    queryKey: ['recentPolicies'],
    queryFn: fetchRecentPolicies,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Policies</CardTitle>
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
            <AlertTitle>Error Loading Recent Policies</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred.'}
            </AlertDescription>
          </Alert>
        ) : policies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent policies found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sum Assured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                  <TableCell>{policy.customerName}</TableCell>
                  <TableCell>{policy.policyType}</TableCell>
                  <TableCell>{formatCurrency(policy.sumAssured)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={policy.status === 'Active' ? 'default' : 'outline'}
                    >
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        policy.paymentStatus === 'Paid' ? 'default' :
                        policy.paymentStatus === 'Partially Paid' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {policy.paymentStatus}
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
