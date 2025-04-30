
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
import { Eye, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PolicyHolderListProps {
  searchTerm: string;
  onSelectPolicyHolder: (id: number) => void;
}

export const PolicyHolderList = ({ searchTerm, onSelectPolicyHolder }: PolicyHolderListProps) => {
  const policyHolders = sampleData.policy_holders || [];
  
  const filteredPolicyHolders = policyHolders.filter(holder => 
    holder.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holder.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holder.policy_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase().replace(' ', '-')) {
      case 'paid':
        return 'success';
      case 'partially-paid':
        return 'warning';
      case 'unpaid':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      {filteredPolicyHolders.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground">
          {searchTerm ? "No policy holders match your search." : "No policy holders available."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Sum Assured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Risk Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicyHolders.map((holder) => (
              <TableRow key={holder.id}>
                <TableCell className="font-medium">{holder.policy_number}</TableCell>
                <TableCell>{holder.customer_name}</TableCell>
                <TableCell>{holder.policy_name}</TableCell>
                <TableCell>Rs. {Number(holder.sum_assured).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(holder.status)}>
                    {holder.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusBadgeVariant(holder.payment_status)}>
                    {holder.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sampleData.underwriting.find(u => u.policy_holder === holder.id)?.risk_category || 'Not Assessed'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSelectPolicyHolder(holder.id)}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
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
