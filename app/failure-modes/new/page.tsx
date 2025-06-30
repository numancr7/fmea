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

const FailureModeForm = () => {
  const router = useRouter();
  const isEditing = false;

  const initialFailureMode = {
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
  };

  const [formData, setFormData] = useState(initialFailureMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting failure mode:', formData);
    
    toast.success(isEditing ? "Failure Mode Updated" : "Failure Mode Created");
    
    router.push('/failure-modes');
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
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Failure Mode' : 'Create New Failure Mode'}</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Failure Mode Details' : 'Enter Failure Mode Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Failure Mode Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="component">Associated Component</Label>
                  <Input 
                    id="component" 
                    name="component"
                    value={formData.component}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select 
                    value={formData.severity}
                    onValueChange={(value) => handleSelectChange('severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probability">Probability</Label>
                  <Select 
                    value={formData.probability}
                    onValueChange={(value) => handleSelectChange('probability', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select probability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detection">Detection</Label>
                  <Select 
                    value={formData.detection}
                    onValueChange={(value) => handleSelectChange('detection', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select detection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskPriorityNumber">Risk Priority Number (RPN)</Label>
                  <Input 
                    id="riskPriorityNumber" 
                    name="riskPriorityNumber"
                    value={formData.riskPriorityNumber}
                    onChange={handleChange}
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
                <Label htmlFor="failureMechanism">Failure Mechanism</Label>
                <Textarea 
                  id="failureMechanism" 
                  name="failureMechanism" 
                  value={formData.failureMechanism}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effect">Effect</Label>
                <Textarea 
                  id="effect" 
                  name="effect" 
                  value={formData.effect}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mitigationTasks">Mitigation Tasks</Label>
                <Textarea 
                  id="mitigationTasks" 
                  name="mitigationTasks" 
                  value={formData.mitigationTasks}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/failure-modes')}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Failure Mode' : 'Create Failure Mode'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FailureModeForm; 
