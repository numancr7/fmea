"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const EditFailureModePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    component: '',
    failureMechanism: '',
    effect: '',
    severity: '',
    probability: '',
    detection: '',
    riskPriorityNumber: '',
    mitigationTasks: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/failure-modes/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || '',
          description: data.description || '',
          component: data.component || '',
          failureMechanism: data.failureMechanism || '',
          effect: data.effect || '',
          severity: data.severity || '',
          probability: data.probability || '',
          detection: data.detection || '',
          riskPriorityNumber: data.riskPriorityNumber || '',
          mitigationTasks: data.mitigationTasks || '',
          notes: data.notes || ''
        }))
        .catch(() => toast.error('Failed to load failure mode data'));
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
      const res = await fetch(`/api/failure-modes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update failure mode');
      toast.success('Failure Mode Updated');
      router.push('/failure-modes');
    } catch (error) {
      toast.error('Failed to update failure mode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/failure-modes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Failure Modes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Failure Mode</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Edit Failure Mode Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="component">Component</Label>
                  <Input id="component" name="component" value={formData.component} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Input id="severity" name="severity" value={formData.severity} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability</Label>
                  <Input id="probability" name="probability" value={formData.probability} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detection">Detection</Label>
                  <Input id="detection" name="detection" value={formData.detection} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskPriorityNumber">Risk Priority Number</Label>
                  <Input id="riskPriorityNumber" name="riskPriorityNumber" value={formData.riskPriorityNumber} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="failureMechanism">Failure Mechanism</Label>
                <Textarea id="failureMechanism" name="failureMechanism" value={formData.failureMechanism} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effect">Effect</Label>
                <Textarea id="effect" name="effect" value={formData.effect} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mitigationTasks">Mitigation Tasks</Label>
                <Textarea id="mitigationTasks" name="mitigationTasks" value={formData.mitigationTasks} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/failure-modes')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update Failure Mode'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditFailureModePage; 