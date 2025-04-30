
import React, { useState } from 'react';
import { sampleData } from '@/utils/data';
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

export const SsvConfig = () => {
  const [isAdding, setIsAdding] = useState(false);
  
  // Get SSV configs and policies from the sample data
  const ssvConfigs = sampleData.ssv_configs || [];
  const policies = sampleData.insurance_policies || [];
  
  // Form state for adding
  const [formData, setFormData] = useState({
    min_year: '',
    max_year: '',
    factor: '',
    eligibility_years: '',
    policy: ''
  });
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting data:', formData);
    // Here you would save the data
    setIsAdding(false);
  };
  
  const handleCancel = () => {
    setIsAdding(false);
  };

  // Get policy name by ID
  const getPolicyName = (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    return policy ? policy.name : 'Unknown Policy';
  };

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
            ssvConfigs.map((config, index) => (
              <TableRow key={index}>
                <TableCell>{getPolicyName(config.policy)}</TableCell>
                <TableCell>Year {config.min_year} - {config.max_year}</TableCell>
                <TableCell>{config.factor}</TableCell>
                <TableCell>{config.eligibility_years} years</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
