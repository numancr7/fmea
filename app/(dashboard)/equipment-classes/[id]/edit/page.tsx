"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const EditEquipmentClassPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lastReviewed: '',
    reviewerList: '',
    classEngineeringDiscipline: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setFetching(true);
      setFetchError(null);
      fetch(`/api/equipment-classes/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Equipment class not found');
          return res.json();
        })
        .then(data => {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            lastReviewed: data.lastReviewed || '',
            reviewerList: data.reviewerList || '',
            classEngineeringDiscipline: data.classEngineeringDiscipline || ''
          });
          setFetching(false);
        })
        .catch(err => {
          setFetchError(err.message);
          setFetching(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/equipment-classes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update equipment class');
      toast({ title: 'Success', description: 'Equipment Class Updated' });
      router.push('/equipment-classes');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update equipment class' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Equipment Class</CardTitle>
        </CardHeader>
        {fetching ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : fetchError ? (
          <div className="p-8 text-center text-destructive">{fetchError}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastReviewed">Last Reviewed</Label>
                <Input id="lastReviewed" name="lastReviewed" type="date" value={formData.lastReviewed} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="reviewerList">Reviewer List</Label>
                <Input id="reviewerList" name="reviewerList" value={formData.reviewerList} onChange={handleChange} placeholder="Comma separated names" />
              </div>
              <div>
                <Label htmlFor="classEngineeringDiscipline">Class Engineering Discipline</Label>
                <Input id="classEngineeringDiscipline" name="classEngineeringDiscipline" value={formData.classEngineeringDiscipline} onChange={handleChange} placeholder="e.g. Mechanical, Electrical" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push('/equipment-classes')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EditEquipmentClassPage;
