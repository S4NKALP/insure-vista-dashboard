import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPolicyHolders } from '@/api/mock/api';
import { toast } from 'sonner';
import { PolicyHolder, Customer } from '@/types';

interface PolicyHolderListProps {
  searchTerm: string;
  onSelectPolicyHolder: (policyHolder: PolicyHolder) => void;
  canEdit?: boolean;
}

export const PolicyHolderList: React.FC<PolicyHolderListProps> = ({
  searchTerm,
  onSelectPolicyHolder,
  canEdit = false,
}) => {
  const [policyHolders, setPolicyHolders] = React.useState<PolicyHolder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPolicyHolders = async () => {
      try {
        setLoading(true);
        const response = await getPolicyHolders();
        if (response.success && response.data) {
          setPolicyHolders(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch policy holders');
        }
      } catch (error) {
        toast.error('Error fetching policy holders');
        console.error('Error fetching policy holders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyHolders();
  }, []);

  const filteredPolicyHolders = policyHolders.filter(holder => {
    const searchLower = searchTerm.toLowerCase();
    const customer = holder.customer as Partial<Customer>;
    return (
      holder.policy_number.toLowerCase().includes(searchLower) ||
      holder.customer_name.toLowerCase().includes(searchLower) ||
      (customer?.email?.toLowerCase() || '').includes(searchLower) ||
      (customer?.phone_number?.toLowerCase() || '').includes(searchLower) ||
      holder.policy_name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Policy</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPolicyHolders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No policy holders found
              </TableCell>
            </TableRow>
          ) : (
            filteredPolicyHolders.map((holder) => {
              const customer = holder.customer as Partial<Customer>;
              return (
                <TableRow key={holder.id}>
                  <TableCell className="font-medium">{holder.policy_number}</TableCell>
                  <TableCell>{holder.customer_name}</TableCell>
                  <TableCell>{customer?.email || '-'}</TableCell>
                  <TableCell>{holder.policy_name}</TableCell>
                  <TableCell>
                    <Badge variant={holder.status === 'Active' ? 'default' : 'secondary'}>
                      {holder.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectPolicyHolder(holder)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
