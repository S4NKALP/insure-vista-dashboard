
import React from 'react';
import { sampleData } from '@/utils/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PolicyListProps {
  searchTerm: string;
}

export const PolicyList = ({ searchTerm }: PolicyListProps) => {
  const policies = sampleData.insurance_policies || [];
  
  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policy_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policy_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredPolicies.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground">
          {searchTerm ? "No policies match your search." : "No policies available."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sum Assured Range</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.policy_code}</TableCell>
                <TableCell>
                  <Badge variant="outline">{policy.policy_type}</Badge>
                </TableCell>
                <TableCell>
                  {Number(policy.min_sum_assured).toLocaleString()} - {Number(policy.max_sum_assured).toLocaleString()}
                </TableCell>
                <TableCell>{(Number(policy.guaranteed_interest_rate) * 100).toFixed(2)}%</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
