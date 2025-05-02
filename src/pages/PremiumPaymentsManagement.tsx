import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PremiumPaymentsList } from '@/components/payments/PremiumPaymentsList';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const PremiumPaymentsManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');
  
  const isSuperAdmin = user?.role === 'superadmin';
  const canEdit = isSuperAdmin || user?.role === 'branch';
  
  // In a real app, these would come from an API
  const paymentStats = {
    totalReceived: 231250,
    pendingAmount: 1156250,
    overdueAmount: 0,
    nextDueCount: 2
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Premium Payments</h1>
          {canEdit && (
            <Button>Record New Payment</Button>
          )}
        </div>
        
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="partial">Partially Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <PremiumPaymentsList canEdit={canEdit} />
          </TabsContent>
          <TabsContent value="paid">
            <PremiumPaymentsList canEdit={canEdit} />
          </TabsContent>
          <TabsContent value="partial">
            <PremiumPaymentsList canEdit={canEdit} />
          </TabsContent>
          <TabsContent value="pending">
            <PremiumPaymentsList canEdit={canEdit} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PremiumPaymentsManagement; 