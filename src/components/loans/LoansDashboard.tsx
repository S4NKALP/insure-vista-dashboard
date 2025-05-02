
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddLoanDialog } from './AddLoanDialog';

const loanTypeData = [
  { name: 'Policy Loans', value: 1250000 },
  { name: 'Mortgage Loans', value: 850000 },
  { name: 'Personal Loans', value: 500000 },
];

const loanStatusData = [
  { name: 'Pending', value: 5 },
  { name: 'Approved', value: 12 },
  { name: 'Rejected', value: 3 },
  { name: 'Completed', value: 9 },
];

const monthlyLoanData = [
  { name: 'Jan', amount: 120000 },
  { name: 'Feb', amount: 180000 },
  { name: 'Mar', amount: 250000 },
  { name: 'Apr', amount: 300000 },
  { name: 'May', amount: 220000 },
  { name: 'Jun', amount: 400000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const LoansDashboard = () => {
  const { user } = useAuth();
  const isBranch = user?.role === 'branch';
  const [addLoanOpen, setAddLoanOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        
        {isBranch && (
          <Button onClick={() => setAddLoanOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Active Loans</CardTitle>
            <CardDescription>Current outstanding loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2600000)}</div>
            <div className="text-xs text-muted-foreground">
              +5% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repayments This Month</CardTitle>
            <CardDescription>Total loan repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(320000)}</div>
            <div className="text-xs text-muted-foreground">
              +12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Loans awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">
              -2 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Loan Disbursement</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLoanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
              <div>
                <h4 className="text-sm font-medium mb-4">By Loan Type</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={loanTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {loanTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">By Status</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={loanStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {loanStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddLoanDialog open={addLoanOpen} onOpenChange={setAddLoanOpen} />
    </div>
  );
};
