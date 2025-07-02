"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const RiskMatrixCellFormPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    severity: '',
    probability: '',
    riskLevel: '',
    color: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/risk-matrix-cells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create risk matrix cell');
      toast.success('Risk Matrix Cell Created');
      router.push('/risk-matrix-cells');
    } catch (error) {
      toast.error('Failed to create risk matrix cell');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Risk Matrix Cell</CardTitle>
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
              {loading ? 'Saving...' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RiskMatrixCellFormPage; 