"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TaskFormPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taskList: '',
    sapGTL: '',
    mainWorkCenter: '',
    interval: '',
    taskType: '',
    taskDescription: '',
    numberOfPerson: '',
    manHour: '',
    equipmentClassId: ''
  });
  const [loading, setLoading] = useState(false);
  const { data: equipmentClasses = [] } = useSWR('/api/equipment-classes', fetcher);

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
    if (!formData.taskList || !formData.taskType || !formData.equipmentClassId) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create task');
      toast.success('Task Created');
      router.push('/tasks');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = [
    { id: 'PM', name: 'PM' },
    { id: 'PPM', name: 'PPM' },
    { id: 'CM', name: 'CM' },
    { id: 'Other', name: 'Other' },
  ];

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="taskList">Task List</Label>
              <Input id="taskList" name="taskList" value={formData.taskList} onChange={handleChange} required placeholder="Enter task list" />
            </div>
            <div>
              <Label htmlFor="sapGTL">SAP GTL</Label>
              <Input id="sapGTL" name="sapGTL" value={formData.sapGTL} onChange={handleChange} placeholder="Enter SAP GTL" />
            </div>
            <div>
              <Label htmlFor="mainWorkCenter">Main Work Center</Label>
              <Input id="mainWorkCenter" name="mainWorkCenter" value={formData.mainWorkCenter} onChange={handleChange} placeholder="Enter work center" />
            </div>
            <div>
              <Label htmlFor="interval">Interval</Label>
              <Input id="interval" name="interval" value={formData.interval} onChange={handleChange} placeholder="e.g., Monthly, Quarterly" />
            </div>
            <div>
              <Label htmlFor="taskType">Task Type</Label>
              <Select value={formData.taskType} onValueChange={v => handleSelectChange('taskType', v)}>
                <SelectTrigger id="taskType">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea id="taskDescription" name="taskDescription" value={formData.taskDescription} onChange={handleChange} placeholder="Enter detailed task description" />
            </div>
            <div>
              <Label htmlFor="numberOfPerson">Number of Person</Label>
              <Input id="numberOfPerson" name="numberOfPerson" type="number" value={formData.numberOfPerson} onChange={handleChange} placeholder="Enter number of persons" />
            </div>
            <div>
              <Label htmlFor="manHour">Man Hour</Label>
              <Input id="manHour" name="manHour" type="number" value={formData.manHour} onChange={handleChange} placeholder="Enter man hours" />
            </div>
            <div>
              <Label htmlFor="equipmentClassId">Equipment Class</Label>
              <Select value={formData.equipmentClassId} onValueChange={v => handleSelectChange('equipmentClassId', v)}>
                <SelectTrigger id="equipmentClassId">
                  <SelectValue placeholder="Select equipment class" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentClasses.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push('/tasks')} disabled={loading}>
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

export default TaskFormPage; 