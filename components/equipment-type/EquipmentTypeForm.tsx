"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface EquipmentType {
  id: string;
  name: string;
  description: string;
  category: string;
  specifications: string;
}

interface EquipmentTypeFormProps {
  equipmentTypeId?: string;
}

const EquipmentTypeForm: React.FC<EquipmentTypeFormProps> = ({ equipmentTypeId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    specifications: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipmentTypeId) {
      // Load equipment type data for editing
      loadEquipmentType();
    }
  }, [equipmentTypeId]);

  const loadEquipmentType = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: EquipmentType = {
        id: equipmentTypeId!,
        name: 'Sample Equipment Type',
        description: 'Sample description',
        category: 'Industrial',
        specifications: 'Sample specifications'
      };
      setFormData({
        name: mockData.name,
        description: mockData.description,
        category: mockData.category,
        specifications: mockData.specifications
      });
    } catch (error) {
      toast.error('Failed to load equipment type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(equipmentTypeId ? 'Equipment type updated successfully' : 'Equipment type created successfully');
      router.push('/equipment-types');
    } catch (error) {
      toast.error('Failed to save equipment type');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {equipmentTypeId ? 'Edit Equipment Type' : 'Create New Equipment Type'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter equipment type name"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>
            
            <div>
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                placeholder="Enter specifications"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (equipmentTypeId ? 'Update' : 'Create')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EquipmentTypeForm; 