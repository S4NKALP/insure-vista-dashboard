import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getPolicies, getSSVConfigs, addSSVConfig, updateSSVConfig, deleteSSVConfig } from '@/api/mock/api';
import { Policy, SSVConfig } from '@/types';
import { toast } from 'sonner';

export const SsvConfig = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SSVConfig | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [ssvConfigs, setSsvConfigs] = useState<SSVConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    min_year: '',
    max_year: '',
    ssv_factor: '',
    eligibility_years: '',
    custom_condition: '',
    policy: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesResponse, ssvConfigsResponse] = await Promise.all([
          getPolicies(),
          getSSVConfigs(1) // Assuming policy ID 1 for now
        ]);

        if (policiesResponse.success && policiesResponse.data) {
          setPolicies(policiesResponse.data);
        }

        if (ssvConfigsResponse.success && ssvConfigsResponse.data) {
          setSsvConfigs(ssvConfigsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedConfig(null);
    setFormData({
      min_year: '',
      max_year: '',
      ssv_factor: '',
      eligibility_years: '',
      custom_condition: '',
      policy: policies.length > 0 ? policies[0].id.toString() : ''
    });
  };

  const handleEditClick = (config: SSVConfig) => {
    setIsEditing(true);
    setIsAdding(false);
    setSelectedConfig(config);
    setFormData({
      min_year: config.min_year.toString(),
      max_year: config.max_year.toString(),
      ssv_factor: config.ssv_factor,
      eligibility_years: config.eligibility_years.toString(),
      custom_condition: config.custom_condition || '',
      policy: config.policy.toString()
    });
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        const response = await deleteSSVConfig(id);
        if (response.success) {
          toast.success('SSV configuration deleted successfully');
          // Refresh the list
          const ssvConfigsResponse = await getSSVConfigs(1);
          if (ssvConfigsResponse.success) {
            setSsvConfigs(ssvConfigsResponse.data);
          }
        } else {
          toast.error('Failed to delete SSV configuration');
        }
      } catch (error) {
        console.error('Error deleting SSV config:', error);
        toast.error('Error deleting SSV configuration');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ssvConfigData = {
        min_year: parseInt(formData.min_year),
        max_year: parseInt(formData.max_year),
        ssv_factor: formData.ssv_factor,
        eligibility_years: parseInt(formData.eligibility_years),
        custom_condition: formData.custom_condition
      };

      let response;
      if (isEditing && selectedConfig) {
        response = await updateSSVConfig(selectedConfig.id, ssvConfigData);
      } else {
        response = await addSSVConfig(parseInt(formData.policy), ssvConfigData);
      }

      if (response.success) {
        toast.success(`SSV configuration ${isEditing ? 'updated' : 'added'} successfully`);
        // Refresh the list
        const ssvConfigsResponse = await getSSVConfigs(1);
        if (ssvConfigsResponse.success) {
          setSsvConfigs(ssvConfigsResponse.data);
        }
        setIsAdding(false);
        setIsEditing(false);
        setSelectedConfig(null);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'add'} SSV configuration`);
      }
    } catch (error) {
      console.error('Error saving SSV config:', error);
      toast.error(`Error ${isEditing ? 'updating' : 'adding'} SSV configuration`);
    }
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedConfig(null);
  };

  // Get policy name by ID
  const getPolicyName = (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    return policy ? policy.name : 'Unknown Policy';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">SSV Configuration</h3>
        {!isAdding && !isEditing && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add SSV Config
          </Button>
        )}
      </div>
      
      {(isAdding || isEditing) && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="policy" className="text-sm font-medium">
                  Policy
                </label>
                <Select 
                  value={formData.policy} 
                  onValueChange={(value) => setFormData({...formData, policy: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {policies.map(policy => (
                      <SelectItem key={policy.id} value={policy.id.toString()}>
                        {policy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="min_year" className="text-sm font-medium">
                    Min Year
                  </label>
                  <Input
                    id="min_year"
                    type="number"
                    value={formData.min_year}
                    onChange={(e) => setFormData({...formData, min_year: e.target.value})}
                    placeholder="2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="max_year" className="text-sm font-medium">
                    Max Year
                  </label>
                  <Input
                    id="max_year"
                    type="number"
                    value={formData.max_year}
                    onChange={(e) => setFormData({...formData, max_year: e.target.value})}
                    placeholder="5"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="ssv_factor" className="text-sm font-medium">
                  SSV Factor
                </label>
                <Input
                  id="ssv_factor"
                  type="text"
                  value={formData.ssv_factor}
                  onChange={(e) => setFormData({...formData, ssv_factor: e.target.value})}
                  placeholder="45.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="eligibility_years" className="text-sm font-medium">
                  Eligibility Years
                </label>
                <Input
                  id="eligibility_years"
                  type="number"
                  value={formData.eligibility_years}
                  onChange={(e) => setFormData({...formData, eligibility_years: e.target.value})}
                  placeholder="4"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label htmlFor="custom_condition" className="text-sm font-medium">
                  Custom Condition
                </label>
                <Input
                  id="custom_condition"
                  type="text"
                  value={formData.custom_condition}
                  onChange={(e) => setFormData({...formData, custom_condition: e.target.value})}
                  placeholder="Optional custom condition"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Configuration
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy</TableHead>
            <TableHead>Year Range</TableHead>
            <TableHead>SSV Factor</TableHead>
            <TableHead>Eligibility Years</TableHead>
            <TableHead>Custom Condition</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ssvConfigs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No SSV configurations defined yet.
              </TableCell>
            </TableRow>
          ) : (
            ssvConfigs.map((config) => (
              <TableRow key={config.id}>
                <TableCell>{getPolicyName(config.policy)}</TableCell>
                <TableCell>Year {config.min_year} - {config.max_year}</TableCell>
                <TableCell>{config.ssv_factor}</TableCell>
                <TableCell>{config.eligibility_years} years</TableCell>
                <TableCell>{config.custom_condition || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(config)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
