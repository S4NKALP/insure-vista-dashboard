
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ClaimsList } from '@/components/claims/ClaimsList';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClaimManagement = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  
  return (
    <DashboardLayout title="Claims Management">
      <div className="space-y-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Claims</TabsTrigger>
            <TabsTrigger value="approved">Approved Claims</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Claims</TabsTrigger>
            <TabsTrigger value="processing">In Processing</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <ClaimsList status="pending" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="approved">
            <ClaimsList status="approved" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="rejected">
            <ClaimsList status="rejected" canEdit={isSuperAdmin} />
          </TabsContent>
          <TabsContent value="processing">
            <ClaimsList status="processing" canEdit={isSuperAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClaimManagement;
