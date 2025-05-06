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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getMortalityRates, addMortalityRate, updateMortalityRate, deleteMortalityRate } from '@/api/mock/api';

interface MortalityRate {
  id: number;
  age_group_start: number;
  age_group_end: number;
  rate: number;
}

export const MortalityRates = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [mortalityRates, setMortalityRates] = useState<MortalityRate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    age_group_start: '',
    age_group_end: '',
    rate: ''
  });

  const fetchMortalityRates = async () => {
    try {
      setLoading(true);
      const response = await getMortalityRates();
      if (response.success && response.data) {
        setMortalityRates(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch mortality rates",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch mortality rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMortalityRates();
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({
      age_group_start: '',
      age_group_end: '',
      rate: ''
    });
  };

  const handleEditClick = (rate: MortalityRate) => {
    setIsEditing(rate.id);
    setIsAdding(false);
    setFormData({
      age_group_start: rate.age_group_start.toString(),
      age_group_end: rate.age_group_end.toString(),
      rate: rate.rate.toString()
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rateData = {
        age_group_start: parseInt(formData.age_group_start),
        age_group_end: parseInt(formData.age_group_end),
        rate: parseFloat(formData.rate)
      };

      let response;
      if (isEditing !== null) {
        response = await updateMortalityRate(isEditing, rateData);
      } else {
        response = await addMortalityRate(rateData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: isEditing ? "Rate updated successfully" : "Rate added successfully",
        });
        fetchMortalityRates();
        handleCancel();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to save rate",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save rate",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMortalityRate(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Rate deleted successfully",
        });
        fetchMortalityRates();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete rate",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rate",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      age_group_start: '',
      age_group_end: '',
      rate: ''
    });
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : mortalityRates.length === 0 ? (
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
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditClick(rate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(rate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
