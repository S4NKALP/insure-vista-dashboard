
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PremiumPaymentsList } from '@/components/payments/PremiumPaymentsList';
import { ClaimPaymentsList } from '@/components/payments/ClaimPaymentsList';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddPaymentDialog } from '@/components/payments/AddPaymentDialog';

const PaymentManagement = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);
  
  return (
    <DashboardLayout title="Payment Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payment Management</h1>
          {isSuperAdmin && (
            <Button onClick={() => setAddPaymentOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          )}
        </div>

        <Tabs defaultValue="premiums" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="premiums">Premium Payments</TabsTrigger>
            <TabsTrigger value="claims">Claim Payouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="premiums">
            <PremiumPaymentsList canEdit={isSuperAdmin} />
          </TabsContent>
          
          <TabsContent value="claims">
            <ClaimPaymentsList canEdit={isSuperAdmin} />
          </TabsContent>
        </Tabs>
      </div>

      {isSuperAdmin && (
        <AddPaymentDialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen} />
      )}
    </DashboardLayout>
  );
};

export default PaymentManagement;
