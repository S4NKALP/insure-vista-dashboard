
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
import { Plus, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const GsvRates = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // Get GSV rates and policies from the sample data
  const gsvRates = sampleData.gsv_rates || [];
  const policies = sampleData.insurance_policies || [];
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    min_year: '',
    max_year: '',
    rate: '',
    policy: ''
  });
  
  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({
      min_year: '',
      max_year: '',
      rate: '',
      policy: policies.length > 0 ? policies[0].id.toString() : ''
    });
  };
  
  const handleEditClick = (rate: any) => {
    setIsEditing(rate.id);
    setIsAdding(false);
    setFormData({
      min_year: rate.min_year.toString(),
      max_year: rate.max_year.toString(),
      rate: rate.rate,
      policy: rate.policy.toString()
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting data:', formData);
    // Here you would save the data
    setIsAdding(false);
    setIsEditing(null);
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  // Get policy name by ID
  const getPolicyName = (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    return policy ? policy.name : 'Unknown Policy';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">GSV Rate Configuration</h3>
        {!isAdding && !isEditing && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add GSV Rate
          </Button>
        )}
      </div>
      
      {(isAdding || isEditing !== null) && (
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
                <label htmlFor="rate" className="text-sm font-medium">
                  Rate (%)
                </label>
                <Input
                  id="rate"
                  type="text"
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: e.target.value})}
                  placeholder="35.00"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isAdding ? 'Add' : 'Update'} Rate
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
            <TableHead>Rate (%)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gsvRates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No GSV rates defined yet.
              </TableCell>
            </TableRow>
          ) : (
            gsvRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{getPolicyName(rate.policy)}</TableCell>
                <TableCell>Year {rate.min_year} - {rate.max_year}</TableCell>
                <TableCell>{rate.rate}%</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditClick(rate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
