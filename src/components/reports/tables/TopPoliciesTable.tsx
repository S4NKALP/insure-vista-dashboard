
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TopPoliciesTableProps {
  branchId: number;
  timeRange: 'weekly' | 'monthly' | 'yearly';
}

export const TopPoliciesTable: React.FC<TopPoliciesTableProps> = ({ branchId, timeRange }) => {
  // Sample data for top policies
  const policies = [
    {
      name: 'Saral Jiwan Beema',
      type: 'Endowment',
      count: 28,
      premium: 1820000,
      trend: 'up',
    },
    {
      name: 'Surakshit Life',
      type: 'Term',
      count: 35,
      premium: 350000,
      trend: 'up',
    },
    {
      name: 'Dhan Varsha',
      type: 'ULIP',
      count: 12,
      premium: 960000,
      trend: 'down',
    },
    {
      name: 'Pension Plus',
      type: 'Pension',
      count: 8,
      premium: 560000,
      trend: 'stable',
    },
    {
      name: 'Child Future',
      type: 'Endowment',
      count: 15,
      premium: 750000,
      trend: 'up',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Premium</TableHead>
              <TableHead className="text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.name}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.type}</TableCell>
                <TableCell className="text-right">{policy.count}</TableCell>
                <TableCell className="text-right">{`Rs. ${policy.premium.toLocaleString()}`}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={policy.trend === 'up' ? 'default' : policy.trend === 'down' ? 'destructive' : 'outline'}>
                    {policy.trend === 'up' ? '↑ Rising' : policy.trend === 'down' ? '↓ Falling' : '→ Stable'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
