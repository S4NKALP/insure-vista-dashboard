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

interface Policy {
  id: number;
  policyNumber: string;
  customerName: string;
  policyType: string;
  sumAssured: string;
  status: string;
  paymentStatus: string;
}

// Get policy data from appData
const getPolicyData = (): Policy[] => {
  return appData.policy_holders.map(policy => ({
    id: policy.id,
    policyNumber: policy.policy_number,
    customerName: policy.customer_name,
    policyType: policy.policy.policy_type,
    sumAssured: policy.sum_assured,
    status: policy.status,
    paymentStatus: policy.payment_status
  }));
};

// Sort policies by ID to get the most recent ones (assuming higher ID = more recent)
const recentPolicies = getPolicyData().sort((a, b) => b.id - a.id).slice(0, 5);

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
            {recentPolicies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">No policies found</TableCell>
              </TableRow>
            ) : (
              recentPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                  <TableCell>{policy.customerName}</TableCell>
                  <TableCell>{policy.policyType}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(policy.sumAssured))}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
