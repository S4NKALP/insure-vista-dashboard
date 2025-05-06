import React, { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PolicyList } from "@/components/policy/PolicyList";
import { AddPolicyForm } from "@/components/policy/AddPolicyForm";
import { MortalityRates } from "@/components/policy/MortalityRates";
import { GsvRates } from "@/components/policy/GsvRates";
import { SsvConfig } from "@/components/policy/SsvConfig";
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState("policies");
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isViewingPolicy, setIsViewingPolicy] = useState(false);
  const { hasPermission } = usePermissions();

  const handleAddPolicy = () => {
    setIsAddingPolicy(true);
    setIsEditingPolicy(false);
    setSelectedPolicy(null);
    setActiveTab("policies");
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setIsEditingPolicy(true);
    setIsAddingPolicy(true);
    setActiveTab("policies");
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setIsViewingPolicy(true);
  };

  const handleCancelAddPolicy = () => {
    setIsAddingPolicy(false);
    setIsEditingPolicy(false);
    setSelectedPolicy(null);
  };

  const handleCloseViewPolicy = () => {
    setIsViewingPolicy(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Policy Management</h1>
          {!isAddingPolicy && (
            <PermissionGate permission="manage_policies">
              <Button onClick={handleAddPolicy} className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Add New Policy
              </Button>
            </PermissionGate>
          )}
        </div>

        <Tabs defaultValue="policies" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <PermissionGate permission="manage_configuration" fallback={<div></div>}>
              <TabsTrigger value="mortality">Mortality Rates</TabsTrigger>
              <TabsTrigger value="gsv">GSV Rates</TabsTrigger>
              <TabsTrigger value="ssv">SSV Configuration</TabsTrigger>
            </PermissionGate>
          </TabsList>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Policies</CardTitle>
                {!isAddingPolicy && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search policies..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isAddingPolicy ? (
                  <AddPolicyForm 
                    onCancel={handleCancelAddPolicy} 
                    initialData={isEditingPolicy ? selectedPolicy : null}
                    isEditing={isEditingPolicy}
                  />
                ) : (
                  <PolicyList 
                      searchTerm={searchTerm}
                      onView={handleViewPolicy}
                      onEdit={hasPermission('manage_policies') ? handleEditPolicy : null}
                      onRefresh={() => {}} 
                      loading={false}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <PermissionGate permission="manage_configuration">
            <TabsContent value="mortality">
              <Card>
                <CardHeader>
                  <CardTitle>Mortality Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <MortalityRates />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gsv">
              <Card>
                <CardHeader>
                  <CardTitle>GSV Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <GsvRates />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ssv">
              <Card>
                <CardHeader>
                  <CardTitle>SSV Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <SsvConfig />
                </CardContent>
              </Card>
            </TabsContent>
          </PermissionGate>
        </Tabs>
      </div>

      {/* View Policy Dialog */}
      {selectedPolicy && (
        <Dialog open={isViewingPolicy} onOpenChange={setIsViewingPolicy}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Policy Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Policy Name</h3>
                <p className="mt-1">{selectedPolicy.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Policy Code</h3>
                <p className="mt-1">{selectedPolicy.policy_code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Policy Type</h3>
                <p className="mt-1">{selectedPolicy.policy_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Base Multiplier</h3>
                <p className="mt-1">{selectedPolicy.base_multiplier}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sum Assured Range</h3>
                <p className="mt-1">
                  {Number(selectedPolicy.min_sum_assured).toLocaleString()} - {Number(selectedPolicy.max_sum_assured).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Guaranteed Interest Rate</h3>
                <p className="mt-1">{(Number(selectedPolicy.guaranteed_interest_rate) * 100).toFixed(2)}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Terminal Bonus Rate</h3>
                <p className="mt-1">{(Number(selectedPolicy.terminal_bonus_rate) * 100).toFixed(2)}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ADB Included</h3>
                <p className="mt-1">{selectedPolicy.include_adb ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">PTD Included</h3>
                <p className="mt-1">{selectedPolicy.include_ptd ? 'Yes' : 'No'}</p>
              </div>
              {selectedPolicy.include_adb && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ADB Percentage</h3>
                  <p className="mt-1">{Number(selectedPolicy.adb_percentage) * 100}%</p>
                </div>
              )}
              {selectedPolicy.include_ptd && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">PTD Percentage</h3>
                  <p className="mt-1">{Number(selectedPolicy.ptd_percentage) * 100}%</p>
                </div>
              )}
              {selectedPolicy.description && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedPolicy.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseViewPolicy}>Close</Button>
              {hasPermission('manage_policies') && (
                <Button onClick={() => {
                  handleEditPolicy(selectedPolicy);
                  setIsViewingPolicy(false);
                }}>
                  Edit Policy
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
