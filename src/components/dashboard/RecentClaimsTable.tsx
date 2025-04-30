
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

interface Claim {
  id: string;
  claimId: string;
  policyNumber: string;
  customerName: string;
  branchName: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing';
}

const recentClaims: Claim[] = [
  {
    id: '1',
    claimId: '2',
    policyNumber: '17514514140001',
    customerName: 'Nur Pratap Karki',
    branchName: 'Kohalpur Branch',
    reason: 'Death',
    amount: 5000000,
    status: 'Pending'
  }
];

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
            {recentClaims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.claimId}</TableCell>
                <TableCell>{claim.policyNumber}</TableCell>
                <TableCell>{claim.customerName}</TableCell>
                <TableCell>{claim.branchName}</TableCell>
                <TableCell>{claim.reason}</TableCell>
                <TableCell>Rs. {claim.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`policy-status policy-status-${claim.status === 'Pending' ? 'pending' : claim.status === 'Approved' ? 'active' : 'inactive'}`}>
                    {claim.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
