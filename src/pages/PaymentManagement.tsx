import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PremiumPaymentsList } from '@/components/payments/PremiumPaymentsList';
import { ClaimPaymentsList } from '@/components/payments/ClaimPaymentsList';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { AddPaymentDialog } from '@/components/payments/AddPaymentDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const PaymentManagement = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const canEdit = isSuperAdmin || user?.role === 'branch';
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [premiumFilter, setPremiumFilter] = React.useState('all');
  
  // Mock payment stats
  const paymentStats = {
    totalReceived: 231250,
    pendingAmount: 1156250,
    overdueAmount: 0,
    nextDueCount: 2
  };
  
  return (
    <DashboardLayout title="Payment Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payment Management</h1>
          {canEdit && (
            <Button onClick={() => setAddPaymentOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record New Payment
            </Button>
          )}
        </div>

        <Tabs defaultValue="premiums" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="premiums">Premium Payments</TabsTrigger>
            <TabsTrigger value="claims">Claim Payouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="premiums">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Received</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentStats.totalReceived)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentStats.pendingAmount)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(paymentStats.overdueAmount)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Due Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{paymentStats.nextDueCount}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={premiumFilter} onValueChange={setPremiumFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Payments</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="partial">Partially Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <PremiumPaymentsList canEdit={canEdit} filter="all" searchTerm={searchTerm} />
                </TabsContent>
                <TabsContent value="paid">
                  <PremiumPaymentsList canEdit={canEdit} filter="Paid" searchTerm={searchTerm} />
                </TabsContent>
                <TabsContent value="partial">
                  <PremiumPaymentsList canEdit={canEdit} filter="Partially Paid" searchTerm={searchTerm} />
                </TabsContent>
                <TabsContent value="pending">
                  <PremiumPaymentsList canEdit={canEdit} filter="Pending" searchTerm={searchTerm} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="claims">
            <ClaimPaymentsList canEdit={isSuperAdmin} />
          </TabsContent>
        </Tabs>
      </div>

      {canEdit && (
        <AddPaymentDialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen} />
      )}
    </DashboardLayout>
  );
};

export default PaymentManagement;
