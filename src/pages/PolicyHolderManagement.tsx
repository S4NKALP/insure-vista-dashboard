
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PolicyHolderList } from "@/components/policyholder/PolicyHolderList";
import { UnderwritingDetails } from "@/components/policyholder/UnderwritingDetails";

export default function PolicyHolderManagement() {
  const [activeTab, setActiveTab] = useState("policyholders");
  const [selectedPolicyHolder, setSelectedPolicyHolder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectPolicyHolder = (id: number) => {
    setSelectedPolicyHolder(id);
    setActiveTab("underwriting");
  };

  const handleBackToList = () => {
    setSelectedPolicyHolder(null);
    setActiveTab("policyholders");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Policy Holder Management</h1>
        </div>

        <Tabs defaultValue="policyholders" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="policyholders">Policy Holders</TabsTrigger>
            <TabsTrigger value="underwriting" disabled={selectedPolicyHolder === null}>
              Underwriting Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policyholders">
            <Card>
              <CardHeader>
                <CardTitle>Policy Holders</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search policy holders..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <PolicyHolderList 
                  searchTerm={searchTerm} 
                  onSelectPolicyHolder={handleSelectPolicyHolder} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="underwriting">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Underwriting Details</CardTitle>
                  <Button variant="outline" onClick={handleBackToList}>
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedPolicyHolder && (
                  <UnderwritingDetails policyHolderId={selectedPolicyHolder} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
