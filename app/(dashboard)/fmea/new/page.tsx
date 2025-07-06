"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const FMEAFormPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    system: '',
    component: '',
    team: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/fmea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create FMEA');
      toast({title:'success',description:'FMEA Created'});
      router.push('/fmea');
    } catch {
      toast({ title: 'Error', description: 'Failed to create FMEA' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New FMEA</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="system">System</Label>
              <Input id="system" name="system" value={formData.system} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="component">Component</Label>
              <Input id="component" name="component" value={formData.component} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="team">Team</Label>
              <Input id="team" name="team" value={formData.team} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push('/fmea')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FMEAFormPage; 