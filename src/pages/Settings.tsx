
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanySettings } from '@/components/settings/CompanySettings';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { UserSettings } from '@/components/settings/UserSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

const Settings = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Manage application settings and configurations
          </p>
        </div>
        
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="user">User Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <CompanySettings isSuperAdmin={isSuperAdmin} />
          </TabsContent>
          
          <TabsContent value="system">
            <SystemSettings isSuperAdmin={isSuperAdmin} />
          </TabsContent>
          
          <TabsContent value="user">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
