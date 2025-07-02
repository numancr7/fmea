"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from 'next-auth/react';
import { toast } from "@/hooks/use-toast";

const EditEquipmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    status: 'Operational',
    installationDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/equipment/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || '',
          description: data.description || '',
          type: data.type || '',
          manufacturer: data.manufacturer || '',
          model: data.model || '',
          serialNumber: data.serialNumber || '',
          location: data.location || '',
          status: data.status || 'Operational',
          installationDate: data.installationDate || ''
        }));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.role !== 'admin') {
      toast({ title: 'Permission Denied', description: 'You must be an admin to update equipment.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update equipment');
      toast({ title: 'Success', description: 'Equipment Updated' });
      router.push('/equipment');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update equipment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Equipment</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="type">Equipment Type</Label>
              <Input id="type" name="type" value={formData.type} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" value={formData.model} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="installationDate">Installation Date</Label>
              <Input id="installationDate" name="installationDate" type="date" value={formData.installationDate} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push('/equipment')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditEquipmentPage; 