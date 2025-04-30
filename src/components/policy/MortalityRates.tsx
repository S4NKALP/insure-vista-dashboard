
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

export const MortalityRates = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // Get mortality rates from the sample data
  const mortalityRates = sampleData.mortality_rates || [];
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    age_group_start: '',
    age_group_end: '',
    rate: ''
  });
  
  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({
      age_group_start: '',
      age_group_end: '',
      rate: ''
    });
  };
  
  const handleEditClick = (rate: any) => {
    setIsEditing(rate.id);
    setIsAdding(false);
    setFormData({
      age_group_start: rate.age_group_start.toString(),
      age_group_end: rate.age_group_end.toString(),
      rate: rate.rate
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Mortality Rate Configuration</h3>
        {!isAdding && !isEditing && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add Rate
          </Button>
        )}
      </div>
      
      {(isAdding || isEditing !== null) && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="age_group_start" className="text-sm font-medium">
                  Age Group Start
                </label>
                <Input
                  id="age_group_start"
                  type="number"
                  value={formData.age_group_start}
                  onChange={(e) => setFormData({...formData, age_group_start: e.target.value})}
                  placeholder="18"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="age_group_end" className="text-sm font-medium">
                  Age Group End
                </label>
                <Input
                  id="age_group_end"
                  type="number"
                  value={formData.age_group_end}
                  onChange={(e) => setFormData({...formData, age_group_end: e.target.value})}
                  placeholder="25"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rate" className="text-sm font-medium">
                  Rate
                </label>
                <Input
                  id="rate"
                  type="text"
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: e.target.value})}
                  placeholder="0.25"
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
            <TableHead>Age Group</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mortalityRates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No mortality rates defined yet.
              </TableCell>
            </TableRow>
          ) : (
            mortalityRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{rate.age_group_start} - {rate.age_group_end} years</TableCell>
                <TableCell>{rate.rate}</TableCell>
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
