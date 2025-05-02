import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { KYCDialog } from "@/components/kyc/KYCDialog";

interface PolicyHolder {
  id: number;
  policy_number: string;
  sum_assured: string;
  duration_years: number;
  date_of_birth: string;
  age: number;
  include_adb: boolean;
  include_ptd: boolean;
  nominee_name: string;
  payment_interval: string;
  risk_category: string;
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

interface UnderwritingDetailsProps {
  policyHolder: PolicyHolder;
  canEdit?: boolean;
}

export const UnderwritingDetails: React.FC<UnderwritingDetailsProps> = ({
  policyHolder,
  canEdit = false,
}) => {
  const [isKYCDialogOpen, setIsKYCDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Policy Information</CardTitle>
            {canEdit && (
              <Button variant="outline" onClick={() => setIsKYCDialogOpen(true)}>
                {policyHolder.kyc ? 'Update KYC' : 'Add KYC'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Policy Number</h3>
              <p className="text-lg">{policyHolder.policy_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Sum Assured</h3>
              <p className="text-lg">Rs. {parseFloat(policyHolder.sum_assured).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Policy Type</h3>
              <p className="text-lg">{policyHolder.policy.policy_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Policy Name</h3>
              <p className="text-lg">{policyHolder.policy.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
              <p className="text-lg">{policyHolder.duration_years} years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge variant={policyHolder.status === 'Active' ? 'default' : 'secondary'}>
                {policyHolder.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
              <Badge variant={policyHolder.payment_status === 'Paid' ? 'default' : 'secondary'}>
                {policyHolder.payment_status}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
              <p className="text-lg">{formatDate(policyHolder.start_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Maturity Date</h3>
              <p className="text-lg">{formatDate(policyHolder.maturity_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
              <p className="text-lg">{policyHolder.branch.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">
                {policyHolder.customer.first_name} {policyHolder.customer.last_name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{policyHolder.customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p className="text-lg">{policyHolder.customer.phone_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
              <p className="text-lg capitalize">{policyHolder.customer.gender === 'M' ? 'Male' : 'Female'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
              <p className="text-lg">{formatDate(policyHolder.date_of_birth)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="text-lg">{policyHolder.age} years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p className="text-lg">{policyHolder.customer.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nominee</h3>
              <p className="text-lg">{policyHolder.nominee_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk & Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Risk Category</h3>
              <p className="text-lg">{policyHolder.risk_category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Interval</h3>
              <p className="text-lg capitalize">{policyHolder.payment_interval}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ADB Coverage</h3>
              <p className="text-lg">{policyHolder.include_adb ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">PTD Coverage</h3>
              <p className="text-lg">{policyHolder.include_ptd ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Agent Code</h3>
              <p className="text-lg">{policyHolder.agent.agent_code}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {policyHolder.kyc && (
        <Card>
          <CardHeader>
            <CardTitle>KYC Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
                <p className="text-lg">{policyHolder.kyc.document_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Document Number</h3>
                <p className="text-lg">{policyHolder.kyc.document_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">PAN Number</h3>
                <p className="text-lg">{policyHolder.kyc.pan_number || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge variant={policyHolder.kyc.status === 'Approved' ? 'default' : 'secondary'}>
                  {policyHolder.kyc.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="text-lg">
                  {policyHolder.kyc.municipality}, {policyHolder.kyc.district}, {policyHolder.kyc.province}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Ward</h3>
                <p className="text-lg">{policyHolder.kyc.ward}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nearest Hospital</h3>
                <p className="text-lg">{policyHolder.kyc.nearest_hospital}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Natural Hazard Exposure</h3>
                <p className="text-lg capitalize">{policyHolder.kyc.natural_hazard_exposure}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Document Front</h3>
                <img
                  src={policyHolder.kyc.document_front}
                  alt="Document Front"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Document Back</h3>
                <img
                  src={policyHolder.kyc.document_back}
                  alt="Document Back"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Photo</h3>
                <img
                  src={policyHolder.kyc.pp_photo}
                  alt="Profile Photo"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              {policyHolder.kyc.pan_front && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">PAN Front</h3>
                  <img
                    src={policyHolder.kyc.pan_front}
                    alt="PAN Front"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <KYCDialog
        open={isKYCDialogOpen}
        onOpenChange={setIsKYCDialogOpen}
        mode={policyHolder.kyc ? 'edit' : 'add'}
        kycData={policyHolder.kyc ? {
          ...policyHolder.kyc,
          customer: {
            id: policyHolder.customer.id,
            first_name: policyHolder.customer.first_name,
            last_name: policyHolder.customer.last_name,
            email: policyHolder.customer.email,
            phone_number: policyHolder.customer.phone_number
          }
        } : undefined}
      />
    </div>
  );
};
