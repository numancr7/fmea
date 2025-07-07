"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TaskType {
  id: string;
  name: string;
}

interface EquipmentClass {
  id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EditTaskPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
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
  
  const taskTypes = useMemo(() => [
    { id: 'PM', name: 'PM' },
    { id: 'PPM', name: 'PPM' },
    { id: 'CM', name: 'CM' },
    { id: 'Other', name: 'Other' },
  ], []);

  const { data: equipmentClasses = [] } = useSWR('/api/equipment-classes', fetcher);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            taskList: data.taskList || '',
            sapGTL: data.sapGTL || '',
            mainWorkCenter: data.mainWorkCenter || '',
            interval: data.interval || '',
            taskType: data.taskType || taskTypes[0].id,
            taskDescription: data.taskDescription || '',
            numberOfPerson: data.numberOfPerson || '',
            manHour: data.manHour || '',
            equipmentClassId: data.equipmentClassId || '',
          });
        });
    }
  }, [id, taskTypes]);

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
    const submitData = {
      ...formData,
      taskType: formData.taskType || taskTypes[0].id,
      equipmentClassId: formData.equipmentClassId || '',
    };
    if (!submitData.taskList || !submitData.taskType || !submitData.equipmentClassId) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      toast.success('Task Updated');
      router.push('/tasks');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
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
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditTaskPage; 