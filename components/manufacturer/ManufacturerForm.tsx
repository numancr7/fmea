"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Manufacturer {
  id: string;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  specialties: string[];
}

interface ManufacturerFormProps {
  manufacturerId?: string;
}

const ManufacturerForm: React.FC<ManufacturerFormProps> = ({ manufacturerId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    specialties: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (manufacturerId) {
      loadManufacturer();
    }
  }, [manufacturerId]);

  const loadManufacturer = async () => {
    try {
      const res = await fetch(`/api/manufacturers/${manufacturerId}`);
      if (!res.ok) throw new Error('Failed to load manufacturer');
      const data = await res.json();
      setFormData({
        name: data.name || '',
        description: data.description || '',
        contactPerson: data.contactPerson || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        specialties: Array.isArray(data.specialties) ? data.specialties.join(', ') : ''
      });
    } catch (error) {
      toast.error({ title: 'Error', description: 'Failed to load manufacturer' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = manufacturerId ? 'PATCH' : 'POST';
      const url = manufacturerId ? `/api/manufacturers/${manufacturerId}` : '/api/manufacturers';
      const payload = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save manufacturer');
      toast.success({ title: 'Success', description: manufacturerId ? 'Manufacturer updated successfully' : 'Manufacturer created successfully' });
      router.push('/manufacturers');
    } catch (error) {
      toast.error({ title: 'Error', description: 'Failed to save manufacturer' });
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
            {manufacturerId ? 'Edit Manufacturer' : 'Create New Manufacturer'}
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
                placeholder="Enter manufacturer name"
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
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
            </div>
            
            <div>
              <Label htmlFor="specialties">Specialties</Label>
              <Textarea
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                placeholder="Enter specialties (comma-separated)"
                rows={2}
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
              {loading ? 'Saving...' : (manufacturerId ? 'Update' : 'Create')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ManufacturerForm; 