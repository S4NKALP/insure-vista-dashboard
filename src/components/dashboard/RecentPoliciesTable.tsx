
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

interface Policy {
  id: string;
  policyNumber: string;
  customerName: string;
  policyType: string;
  sumAssured: number;
  status: 'Active' | 'Inactive' | 'Pending';
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
}

const recentPolicies: Policy[] = [
  {
    id: '1',
    policyNumber: '17514514140001',
    customerName: 'Nur Pratap Karki',
    policyType: 'Saral Jiwan Beema',
    sumAssured: 5000000,
    status: 'Active',
    paymentStatus: 'Partially Paid'
  },
  {
    id: '2',
    policyNumber: '17514514140002',
    customerName: 'Sumitra Bam',
    policyType: 'Saral Jiwan Beema',
    sumAssured: 1000000,
    status: 'Active',
    paymentStatus: 'Paid'
  }
];

export const RecentPoliciesTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Sum Assured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                <TableCell>{policy.customerName}</TableCell>
                <TableCell>{policy.policyType}</TableCell>
                <TableCell>Rs. {policy.sumAssured.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`policy-status policy-status-${policy.status.toLowerCase()}`}>
                    {policy.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`payment-status payment-status-${policy.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                    {policy.paymentStatus}
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
