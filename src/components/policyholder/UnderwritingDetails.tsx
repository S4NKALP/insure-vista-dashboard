import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { KYCDialog } from "@/components/kyc/KYCDialog";
import { PolicyHolder, Customer } from '@/types';

interface UnderwritingDetailsProps {
  policyHolder: PolicyHolder;
  canEdit?: boolean;
}

export const UnderwritingDetails: React.FC<UnderwritingDetailsProps> = ({
  policyHolder,
  canEdit = false,
}) => {
  const [isKYCDialogOpen, setIsKYCDialogOpen] = React.useState(false);
  const customer = policyHolder.customer as Partial<Customer>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Policy Information</CardTitle>
            {canEdit && (
              <Button variant="outline" onClick={() => setIsKYCDialogOpen(true)}>
                Update Details
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
              <h3 className="text-sm font-medium text-muted-foreground">Policy Name</h3>
              <p className="text-lg">{policyHolder.policy_name}</p>
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
              <p className="text-lg">{policyHolder.customer_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{customer?.email || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p className="text-lg">{customer?.phone_number || policyHolder.phone_number || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p className="text-lg">{customer?.address || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
              <p className="text-lg">{policyHolder.date_of_birth ? formatDate(policyHolder.date_of_birth) : '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="text-lg">{policyHolder.age ? `${policyHolder.age} years` : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nominee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{policyHolder.nominee_name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Relation</h3>
              <p className="text-lg">{policyHolder.nominee_relation || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
              <p className="text-lg">{policyHolder.nominee_document_type || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Document Number</h3>
              <p className="text-lg">{policyHolder.nominee_document_number || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Health History</h3>
              <p className="text-lg">{policyHolder.health_history || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Habits</h3>
              <p className="text-lg">{policyHolder.habits || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Exercise Frequency</h3>
              <p className="text-lg">{policyHolder.exercise_frequency || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Lifestyle</h3>
              <p className="text-lg">
                {policyHolder.alcoholic ? 'Alcoholic' : 'Non-alcoholic'}, {policyHolder.smoker ? 'Smoker' : 'Non-smoker'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Family Medical History</h3>
              <p className="text-lg">{policyHolder.family_medical_history || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Yearly Income</h3>
              <p className="text-lg">Rs. {policyHolder.yearly_income ? parseFloat(policyHolder.yearly_income).toLocaleString() : '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Assets Details</h3>
              <p className="text-lg">{policyHolder.assets_details || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policy Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
              <p className="text-lg">{policyHolder.start_date ? formatDate(policyHolder.start_date) : '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Maturity Date</h3>
              <p className="text-lg">{policyHolder.maturity_date ? formatDate(policyHolder.maturity_date) : '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Interval</h3>
              <p className="text-lg capitalize">{policyHolder.payment_interval || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
              <Badge variant={policyHolder.payment_status === 'Paid' ? 'default' : 'secondary'}>
                {policyHolder.payment_status || 'Pending'}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Risk Category</h3>
              <p className="text-lg">{policyHolder.risk_category || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Additional Benefits</h3>
              <p className="text-lg">
                ADB: {policyHolder.include_adb ? 'Yes' : 'No'}, PTD: {policyHolder.include_ptd ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <KYCDialog
        open={isKYCDialogOpen}
        onOpenChange={setIsKYCDialogOpen}
        mode="edit"
        kycData={{
          id: policyHolder.id,
          document_type: policyHolder.nominee_document_type || '',
          document_number: policyHolder.nominee_document_number?.toString() || '',
          document_front: policyHolder.nominee_document_front || '',
          document_back: policyHolder.nominee_document_back || '',
          pan_number: null,
          pan_front: null,
          pan_back: null,
          pp_photo: policyHolder.nominee_pp_photo || '',
          province: "",
          district: "",
          municipality: "",
          ward: "",
          nearest_hospital: "",
          natural_hazard_exposure: "low",
          status: "Pending",
          customer: {
            id: customer?.id || 0,
            first_name: customer?.first_name || '',
            last_name: customer?.last_name || '',
            email: customer?.email || '',
            phone_number: customer?.phone_number || ''
          }
        }}
      />
    </div>
  );
};
