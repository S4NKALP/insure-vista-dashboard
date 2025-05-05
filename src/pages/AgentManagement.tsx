import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { AgentList } from '@/components/agent/AgentList';
import { AgentApplicationList } from '@/components/agent/AgentApplicationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const AgentManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("agents");
  const { user } = useAuth();
  const issuperadmin = user?.role === 'superadmin';
  const branchId = user?.role === 'branch' ? Number(user?.branch) : undefined;
  
  return (
    <DashboardLayout title="Agent Management">
      <div className="space-y-6">
        <Tabs 
          defaultValue="agents" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="applications">Agent Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agents" className="py-2">
            <AgentList issuperadmin={issuperadmin} branchId={branchId?.toString()} />
          </TabsContent>
          <TabsContent value="applications" className="py-2">
            <AgentApplicationList issuperadmin={issuperadmin} branchId={branchId} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentManagement;
