import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import appData from '@/api/mock/data';
import { formatCurrency } from '@/lib/utils';

interface Claim {
  id: number;
  claimId: string;
  policyNumber: string;
  customerName: string;
  branchName: string;
  reason: string;
  amount: string;
  status: string;
}

// Get claim data from appData
const getClaimData = (): Claim[] => {
  return appData.claim_requests.map(claim => ({
    id: claim.id,
    claimId: claim.id.toString(),
    policyNumber: claim.policy_holder_number,
    customerName: claim.customer_name,
    branchName: claim.branch_name,
    reason: claim.reason || 'Not specified',
    amount: claim.claim_amount,
    status: claim.status
  }));
};

// Sort claims by ID to get the most recent ones (assuming higher ID = more recent)
const recentClaims = getClaimData().sort((a, b) => b.id - a.id).slice(0, 5);

export const RecentClaimsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Claims</CardTitle>
      </CardHeader>
      <CardContent>
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
            {recentClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">No claims found</TableCell>
              </TableRow>
            ) : (
              recentClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claimId}</TableCell>
                  <TableCell>{claim.policyNumber}</TableCell>
                  <TableCell>{claim.customerName}</TableCell>
                  <TableCell>{claim.branchName}</TableCell>
                  <TableCell>{claim.reason}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(claim.amount))}</TableCell>
                  <TableCell>
                    <span className={`policy-status policy-status-${claim.status === 'Pending' ? 'pending' : claim.status === 'Approved' ? 'active' : 'inactive'}`}>
                      {claim.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
