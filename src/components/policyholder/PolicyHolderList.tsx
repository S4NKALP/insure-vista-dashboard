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

interface PolicyHolder {
  id: number;
  policy_number: string;
  sum_assured: string;
  duration_years: number;
  status: string;
  payment_status: string;
  start_date: string;
  maturity_date: string;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    gender: string;
  };
  branch: {
    id: number;
    name: string;
    branch_code: number;
  };
  policy: {
    id: number;
    name: string;
    policy_code: string;
    policy_type: string;
  };
  agent: {
    id: number;
    agent_code: string;
  };
  kyc?: {
    id: number;
    document_type: string;
    document_number: string;
    document_front: string;
    document_back: string;
    pan_number: string | null;
    pan_front: string | null;
    pan_back: string | null;
    pp_photo: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
    nearest_hospital: string;
    natural_hazard_exposure: string;
    status: string;
  };
}

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
  // Mock data based on data.json format
  const policyHolders: PolicyHolder[] = [
    {
      id: 1,
      policy_number: "1751451440001",
      sum_assured: "5000000.00",
      duration_years: 10,
      status: "Active",
      payment_status: "Partially Paid",
      start_date: "2025-04-29",
      maturity_date: "2035-04-29",
      customer: {
        id: 1,
        first_name: "Nur Pratap",
        last_name: "Karki",
        email: "nurprtapkarki@gmail.com",
        phone_number: "9840693765",
        address: "Kohalpur, 11 Banke",
        gender: "M"
      },
      branch: {
        id: 1,
        name: "Kohalpur Branch",
        branch_code: 145
      },
      policy: {
        id: 1,
        name: "Saral Jiwan Beema",
        policy_code: "144",
        policy_type: "Endownment"
      },
      agent: {
        id: 1,
        agent_code: "A-1-0006"
      },
      kyc: {
        id: 1,
        document_type: "Citizenship",
        document_number: "10000",
        document_front: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8.45.25_PM.jpeg",
        document_back: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8_72Tm8cT.45.25_PM.jpeg",
        pan_number: null,
        pan_front: null,
        pan_back: null,
        pp_photo: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8_jM6Q6rt.45.25_PM.jpeg",
        province: "Lumbini",
        district: "Banke",
        municipality: "Kohalpur",
        ward: "10",
        nearest_hospital: "Nepaljung Medical collage, Kohalpur",
        natural_hazard_exposure: "low",
        status: "Pending"
      }
    }
  ];

  const filteredPolicyHolders = policyHolders.filter(holder => {
    const searchLower = searchTerm.toLowerCase();
    return (
      holder.policy_number.toLowerCase().includes(searchLower) ||
      holder.customer.first_name.toLowerCase().includes(searchLower) ||
      holder.customer.last_name.toLowerCase().includes(searchLower) ||
      holder.customer.email.toLowerCase().includes(searchLower) ||
      holder.customer.phone_number?.toLowerCase().includes(searchLower) ||
      holder.policy.name.toLowerCase().includes(searchLower)
    );
  });

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
          {filteredPolicyHolders.map((holder) => (
            <TableRow key={holder.id}>
              <TableCell className="font-medium">{holder.policy_number}</TableCell>
              <TableCell>{`${holder.customer.first_name} ${holder.customer.last_name}`}</TableCell>
              <TableCell>{holder.customer.email}</TableCell>
              <TableCell>{holder.policy.name}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
