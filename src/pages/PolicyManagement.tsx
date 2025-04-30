
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

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState("policies");
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddPolicy = () => {
    setIsAddingPolicy(true);
    setActiveTab("policies");
  };

  const handleCancelAddPolicy = () => {
    setIsAddingPolicy(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Policy Management</h1>
          {!isAddingPolicy && (
            <Button onClick={handleAddPolicy} className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" /> Add New Policy
            </Button>
          )}
        </div>

        <Tabs defaultValue="policies" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="mortality">Mortality Rates</TabsTrigger>
            <TabsTrigger value="gsv">GSV Rates</TabsTrigger>
            <TabsTrigger value="ssv">SSV Configuration</TabsTrigger>
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
                  <AddPolicyForm onCancel={handleCancelAddPolicy} />
                ) : (
                  <PolicyList searchTerm={searchTerm} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
