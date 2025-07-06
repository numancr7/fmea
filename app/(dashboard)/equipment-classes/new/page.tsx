"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

const EquipmentClassFormPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lastReviewed: '',
    reviewerList: '',
    classEngineeringDiscipline: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/equipment-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create equipment class');
      toast({ title: 'Success', description: 'Equipment Class Created' });
      router.push('/equipment-classes');
    } catch {
      toast({ title: 'Error', description: 'Failed to create equipment class' });
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/equipment-classes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Equipment Classes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Equipment Class</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Enter Equipment Class Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastReviewed">Last Reviewed</Label>
                  <Input
                    id="lastReviewed"
                    name="lastReviewed"
                    type="date"
                    value={formData.lastReviewed}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewerList">Reviewer List</Label>
                <Input
                  id="reviewerList"
                  name="reviewerList"
                  value={formData.reviewerList}
                  onChange={handleChange}
                  placeholder="Comma separated names"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classEngineeringDiscipline">Class Engineering Discipline</Label>
                <Input
                  id="classEngineeringDiscipline"
                  name="classEngineeringDiscipline"
                  value={formData.classEngineeringDiscipline}
                  onChange={handleChange}
                  placeholder="e.g. Mechanical, Electrical"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/equipment-classes')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Equipment Class
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentClassFormPage; 
