"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const FailureModeForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    rpn: '',
    riskRating: '',
    severity: '',
    probability: '',
    detectability: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/failure-modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create failure mode');
      toast.success('Failure Mode Created');
      router.push('/failure-modes');
    } catch {
      toast.error('Failed to create failure mode');
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
          <h1 className="text-2xl font-bold">Create New Failure Mode</h1>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Enter Failure Mode Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Enter failure mode description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpn">RPN</Label>
                  <Input id="rpn" name="rpn" value={formData.rpn} onChange={handleChange} placeholder="Enter RPN" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskRating">Risk Rating</Label>
                  <Input id="riskRating" name="riskRating" value={formData.riskRating} onChange={handleChange} placeholder="Enter risk rating (low, medium, high, critical)" />
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
                  <Label htmlFor="detectability">Detectability</Label>
                  <Select value={formData.detectability} onValueChange={v => handleSelectChange('detectability', v)}>
                    <SelectTrigger id="detectability">
                      <SelectValue placeholder="Select detectability" />
                    </SelectTrigger>
                    <SelectContent>
                      {detectionOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter notes" rows={3} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/failure-modes')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Failure Mode
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FailureModeForm; 
