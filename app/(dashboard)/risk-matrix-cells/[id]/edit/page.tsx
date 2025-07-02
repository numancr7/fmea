"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const EditRiskMatrixCellPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [formData, setFormData] = useState({
    severity: '',
    probability: '',
    riskLevel: '',
    color: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/risk-matrix-cells/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          severity: data.severity || '',
          probability: data.probability || '',
          riskLevel: data.riskLevel || '',
          color: data.color || '',
          description: data.description || ''
        }))
        .catch(() => toast.error('Failed to load risk matrix cell data'));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/risk-matrix-cells/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update risk matrix cell');
      toast.success('Risk Matrix Cell Updated');
      router.push('/risk-matrix-cells');
    } catch (error) {
      toast.error('Failed to update risk matrix cell');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Risk Matrix Cell</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Input id="severity" name="severity" value={formData.severity} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="probability">Probability</Label>
              <Input id="probability" name="probability" value={formData.probability} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Input id="riskLevel" name="riskLevel" value={formData.riskLevel} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" value={formData.color} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push('/risk-matrix-cells')} disabled={loading}>
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

export default EditRiskMatrixCellPage; 