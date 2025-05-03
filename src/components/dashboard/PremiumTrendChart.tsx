import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import appData from '@/api/mock/data';
import { formatCurrency } from '@/lib/utils';

// Generate premium trend data from actual premium payments
const generatePremiumTrendData = () => {
  const { premium_payments } = appData;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize monthly data with zeros
  const monthlyData = new Map();
  monthNames.forEach(month => {
    monthlyData.set(month, 0);
  });
  
  // Aggregate premium amounts by month
  premium_payments.forEach(payment => {
    // Use the next_payment_date as a proxy since we don't have payment history
    if (payment.next_payment_date) {
      const paymentDate = new Date(payment.next_payment_date);
      const monthName = monthNames[paymentDate.getMonth()];
      const currentAmount = monthlyData.get(monthName) || 0;
      monthlyData.set(monthName, currentAmount + parseFloat(payment.total_paid || '0'));
    }
  });
  
  // Convert map to array format for the chart
  return monthNames.map(month => ({
    name: month,
    amount: monthlyData.get(month)
  }));
};

const data = generatePremiumTrendData();

export const PremiumTrendChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Premium Collection Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value / 1000}k`}
                width={40}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#8a5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
