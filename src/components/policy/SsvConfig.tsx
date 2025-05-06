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
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getPolicies, getSSVConfig, addSSVConfig } from '@/api/mock/api';
import { Policy, SSVConfig } from '@/types';

export const SsvConfig = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [ssvConfigs, setSsvConfigs] = useState<SSVConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for adding
  const [formData, setFormData] = useState({
    min_year: '',
    max_year: '',
    factor: '',
    eligibility_years: '',
    policy: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesResponse, ssvConfigsResponse] = await Promise.all([
          getPolicies(),
          getSSVConfig(0, {} as SSVConfig) // You might need to adjust this based on your API
        ]);

        if (policiesResponse.success && policiesResponse.data) {
          setPolicies(policiesResponse.data);
        }

        if (ssvConfigsResponse.success && ssvConfigsResponse.data) {
          setSsvConfigs(Array.isArray(ssvConfigsResponse.data) ? ssvConfigsResponse.data : [ssvConfigsResponse.data]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleAddClick = () => {
    setIsAdding(true);
    setFormData({
      min_year: '',
      max_year: '',
      factor: '',
      eligibility_years: '',
      policy: policies.length > 0 ? policies[0].id.toString() : ''
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ssvConfigData = {
        min_year: parseInt(formData.min_year),
        max_year: parseInt(formData.max_year),
        ssv_factor: formData.factor,
        eligibility_years: formData.eligibility_years
      };

      const response = await addSSVConfig(parseInt(formData.policy), ssvConfigData);

      if (response.success) {
        // Refresh the SSV configs list
        const ssvConfigsResponse = await getSSVConfig(0, {} as SSVConfig);
        if (ssvConfigsResponse.success && ssvConfigsResponse.data) {
          setSsvConfigs(Array.isArray(ssvConfigsResponse.data) ? ssvConfigsResponse.data : [ssvConfigsResponse.data]);
        }
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error saving SSV config:', error);
    }
  };
  
  const handleCancel = () => {
    setIsAdding(false);
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
        {!isAdding && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add SSV Config
          </Button>
        )}
      </div>
      
      {isAdding && (
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
                <label htmlFor="factor" className="text-sm font-medium">
                  Factor
                </label>
                <Input
                  id="factor"
                  type="text"
                  value={formData.factor}
                  onChange={(e) => setFormData({...formData, factor: e.target.value})}
                  placeholder="0.85"
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
                  placeholder="3"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Add Configuration</Button>
            </div>
          </form>
        </Card>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy</TableHead>
            <TableHead>Year Range</TableHead>
            <TableHead>Factor</TableHead>
            <TableHead>Eligibility Years</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ssvConfigs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
