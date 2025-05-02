import React from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { KYCDialog } from "./KYCDialog";

interface KYCData {
  id: number;
  document_type: string;
  document_number: string;
  document_front: string;
  document_back: string;
  pan_number: string | null;
  pan_front: string | null;
  pan_back: string | null;
  pp_photo: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  nearest_hospital: string;
  natural_hazard_exposure: string;
  status: string;
  customer: {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    phone_number: string | null;
    address: string;
    gender: string;
  };
}

export const KYCManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("pending");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedKYC, setSelectedKYC] = React.useState<KYCData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const isSuperAdmin = user?.role === 'superadmin';
  const isBranchUser = user?.role === 'branch';

  // In a real app, this would come from an API
  const kycData: KYCData[] = [
    {
      id: 1,
      document_type: "Citizenship",
      document_number: "10000",
      document_front: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8.45.25_PM.jpeg",
      document_back: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8_72Tm8cT.45.25_PM.jpeg",
      pan_number: null,
      pan_front: null,
      pan_back: null,
      pp_photo: "http://127.0.0.1:8000/media/customer_kyc/WhatsApp_Image_2025-04-18_at_8_jM6Q6rt.45.25_PM.jpeg",
      province: "Lumbini",
      district: "Banke",
      municipality: "Kohalpur",
      ward: "10",
      nearest_hospital: "Nepaljung Medical collage, Kohalpur",
      natural_hazard_exposure: "low",
      status: "Pending",
      customer: {
        id: 1,
        first_name: "Nur Pratap",
        middle_name: null,
        last_name: "Karki",
        email: "nurprtapkarki@gmail.com",
        phone_number: "9840693765",
        address: "",
        gender: ""
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleAddKYC = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditKYC = (kyc: KYCData) => {
    setSelectedKYC(kyc);
    setIsEditDialogOpen(true);
  };

  const filteredKYC = kycData.filter(kyc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      kyc.customer.first_name.toLowerCase().includes(searchLower) ||
      kyc.customer.last_name.toLowerCase().includes(searchLower) ||
      kyc.document_number.toLowerCase().includes(searchLower) ||
      kyc.customer.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">KYC Management</h1>
          {(isSuperAdmin || isBranchUser) && (
            <Button onClick={handleAddKYC}>
              Add New KYC
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>KYC Documents</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search KYC..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKYC.map((kyc) => (
                  <TableRow key={kyc.id}>
                    <TableCell>
                      {kyc.customer.first_name} {kyc.customer.last_name}
                    </TableCell>
                    <TableCell>{kyc.document_type}</TableCell>
                    <TableCell>{kyc.document_number}</TableCell>
                    <TableCell>
                      {kyc.municipality}, {kyc.district}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(kyc.status)}>
                        {kyc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isSuperAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditKYC(kyc)}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <KYCDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
      />

      {selectedKYC && (
        <KYCDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mode="edit"
          kycData={selectedKYC}
        />
      )}
    </DashboardLayout>
  );
}; 