"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const severityOptions = ["Low", "Medium", "High", "Critical"];
const probabilityOptions = ["Low", "Medium", "High"];
const detectionOptions = ["Low", "Medium", "High"];

const EditFailureModePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: failureMode, isLoading } = useSWR(id ? `/api/failure-modes/${id}` : null, (url) => fetch(url).then(res => res.json()));
  const [formData, setFormData] = useState({
    name: '',
    associatedComponent: '',
    severity: '',
    probability: '',
    detection: '',
    rpn: '',
    description: '',
    failureMechanism: '',
    effect: '',
    mitigationTasks: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (failureMode) {
      setFormData({
        name: failureMode.name || '',
        associatedComponent: failureMode.associatedComponent || '',
        severity: failureMode.severity || '',
        probability: failureMode.probability || '',
        detection: failureMode.detection || '',
        rpn: failureMode.rpn || '',
        description: failureMode.description || '',
        failureMechanism: failureMode.failureMechanism || '',
        effect: failureMode.effect || '',
        mitigationTasks: failureMode.mitigationTasks || '',
        notes: failureMode.notes || '',
      });
    }
  }, [failureMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name) {
        toast.error('Failure Mode Name is required');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/failure-modes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update failure mode');
      toast.success('Failure Mode Updated');
      router.push('/failure-modes');
    } catch {
      toast.error('Failed to update failure mode');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

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
                  <Label htmlFor="name">Failure Mode Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter failure mode name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="associatedComponent">Associated Component</Label>
                  <Input id="associatedComponent" name="associatedComponent" value={formData.associatedComponent} onChange={handleChange} placeholder="Enter associated component" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={formData.severity} onValueChange={v => handleSelectChange('severity', v)}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability</Label>
                  <Select value={formData.probability} onValueChange={v => handleSelectChange('probability', v)}>
                    <SelectTrigger id="probability">
                      <SelectValue placeholder="Select probability" />
                    </SelectTrigger>
                    <SelectContent>
                      {probabilityOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detection">Detection</Label>
                  <Select value={formData.detection} onValueChange={v => handleSelectChange('detection', v)}>
                    <SelectTrigger id="detection">
                      <SelectValue placeholder="Select detection" />
                    </SelectTrigger>
                    <SelectContent>
                      {detectionOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpn">Risk Priority Number (RPN)</Label>
                  <Input id="rpn" name="rpn" value={formData.rpn} onChange={handleChange} placeholder="Enter RPN" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="failureMechanism">Failure Mechanism</Label>
                <Textarea id="failureMechanism" name="failureMechanism" value={formData.failureMechanism} onChange={handleChange} placeholder="Enter failure mechanism" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effect">Effect</Label>
                <Textarea id="effect" name="effect" value={formData.effect} onChange={handleChange} placeholder="Enter effect" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mitigationTasks">Mitigation Tasks</Label>
                <Textarea id="mitigationTasks" name="mitigationTasks" value={formData.mitigationTasks} onChange={handleChange} placeholder="Enter mitigation tasks" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter notes" rows={2} />
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