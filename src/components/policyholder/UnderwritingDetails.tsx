
import React from 'react';
import { sampleData } from '@/utils/data';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from 'lucide-react';

interface UnderwritingDetailsProps {
  policyHolderId: number;
}

export const UnderwritingDetails = ({ policyHolderId }: UnderwritingDetailsProps) => {
  // Get policy holder and underwriting data
  const policyHolder = sampleData.policy_holders.find(p => p.id === policyHolderId);
  const underwritingData = sampleData.underwriting.find(u => u.policy_holder === policyHolderId);
  
  if (!policyHolder) {
    return <div className="text-center py-6">Policy holder not found.</div>;
  }

  // Function to get risk badge color
  const getRiskBadgeVariant = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'low':
        return 'default';
      case 'moderate':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Full Name</dt>
                <dd className="text-sm">{policyHolder.customer_name}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Policy Number</dt>
                <dd className="text-sm font-mono">{policyHolder.policy_number}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Date of Birth</dt>
                <dd className="text-sm">{policyHolder.date_of_birth || 'N/A'}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Phone Number</dt>
                <dd className="text-sm">{policyHolder.phone_number || 'N/A'}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Yearly Income</dt>
                <dd className="text-sm">Rs. {Number(policyHolder.yearly_income || 0).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Policy Type</dt>
                <dd className="text-sm">{policyHolder.policy?.policy_type}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Sum Assured</dt>
                <dd className="text-sm">Rs. {Number(policyHolder.sum_assured).toLocaleString()}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Duration</dt>
                <dd className="text-sm">{policyHolder.duration_years} Years</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Start Date</dt>
                <dd className="text-sm">{policyHolder.start_date}</dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <dt className="text-sm font-medium">Maturity Date</dt>
                <dd className="text-sm">{policyHolder.maturity_date}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Underwriting Assessment</CardTitle>
            {underwritingData && (
              <Badge variant={getRiskBadgeVariant(underwritingData.risk_category)} className="ml-2">
                {underwritingData.risk_category || 'Not Assessed'} Risk
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!underwritingData ? (
            <p className="text-center py-3 text-muted-foreground">No underwriting data available.</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium mb-1">Risk Assessment Score</p>
                  <p className="text-2xl font-bold">{underwritingData.risk_assessment_score}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium mb-1">Manual Override</p>
                  <p className="text-lg flex items-center">
                    {underwritingData.manual_override ? (
                      <>
                        <Check className="mr-1 h-5 w-5 text-green-500" />
                        Yes
                      </>
                    ) : (
                      <>
                        <X className="mr-1 h-5 w-5 text-red-500" />
                        No
                      </>
                    )}
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium mb-1">Last Updated</p>
                  <p className="text-sm">{new Date(underwritingData.last_updated_at).toLocaleDateString()} by {underwritingData.last_updated_by}</p>
                </div>
              </div>

              <Tabs defaultValue="health">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="health">Health Profile</TabsTrigger>
                  <TabsTrigger value="financial">Financial Review</TabsTrigger>
                  <TabsTrigger value="nominees">Nominees</TabsTrigger>
                </TabsList>

                <TabsContent value="health" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Health Summary</h4>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Health History:</span>
                          <span className="font-medium">{policyHolder.health_history || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Exercise Frequency:</span>
                          <span className="font-medium">{policyHolder.exercise_frequency || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Family Medical History:</span>
                          <span className="font-medium">{policyHolder.family_medical_history || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Risk Factors</h4>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Alcoholic:</span>
                          <span className="font-medium flex items-center">
                            {policyHolder.alcoholic ? (
                              <>
                                <Check className="mr-1 h-4 w-4 text-red-500" />
                                Yes
                              </>
                            ) : (
                              <>
                                <X className="mr-1 h-4 w-4 text-green-500" />
                                No
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Smoker:</span>
                          <span className="font-medium flex items-center">
                            {policyHolder.smoker ? (
                              <>
                                <Check className="mr-1 h-4 w-4 text-red-500" />
                                Yes
                              </>
                            ) : (
                              <>
                                <X className="mr-1 h-4 w-4 text-green-500" />
                                No
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/40 rounded">
                          <span>Habits:</span>
                          <span className="font-medium">{policyHolder.habits || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Financial Profile</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <p className="text-sm font-medium mb-1">Yearly Income</p>
                        <p className="text-2xl font-bold">Rs. {Number(policyHolder.yearly_income || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm font-medium mb-1">Sum Assured Ratio</p>
                        <p className="text-2xl font-bold">
                          {policyHolder.yearly_income ? (
                            (Number(policyHolder.sum_assured) / Number(policyHolder.yearly_income)).toFixed(1) + 'x'
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Assets Details</h4>
                      <p className="text-sm text-muted-foreground">
                        {policyHolder.assets_details || 'No assets information provided.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="nominees" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">Nominee Details</h4>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Nominee Name:</span>
                            <span className="font-medium">{policyHolder.nominee_name || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Relationship:</span>
                            <span className="font-medium">{policyHolder.nominee_relation || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Document Type:</span>
                            <span className="font-medium">{policyHolder.nominee_document_type || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Document Number:</span>
                            <span className="font-medium">{policyHolder.nominee_document_number || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Emergency Contact</h4>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Contact Name:</span>
                            <span className="font-medium">{policyHolder.emergency_contact_name || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted/40 rounded">
                            <span>Contact Number:</span>
                            <span className="font-medium">{policyHolder.emergency_contact_number || 'Same as policyholder'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {underwritingData.remarks && (
                <div className="p-4 border rounded-md mt-4">
                  <h4 className="font-medium mb-2">Underwriter Remarks</h4>
                  <p className="text-sm">{underwritingData.remarks}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
