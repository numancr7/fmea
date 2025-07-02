"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

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

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          taskList: data.taskList || '',
          sapGTL: data.sapGTL || '',
          mainWorkCenter: data.mainWorkCenter || '',
          interval: data.interval || '',
          taskType: data.taskType || '',
          taskDescription: data.taskDescription || '',
          numberOfPerson: data.numberOfPerson || '',
          manHour: data.manHour || '',
          equipmentClassId: data.equipmentClassId || ''
        }));
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
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      toast.success('Task Updated');
      router.push('/tasks');
    } catch (error) {
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
              <Input id="taskList" name="taskList" value={formData.taskList} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="sapGTL">SAP GTL</Label>
              <Input id="sapGTL" name="sapGTL" value={formData.sapGTL} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="mainWorkCenter">Main Work Center</Label>
              <Input id="mainWorkCenter" name="mainWorkCenter" value={formData.mainWorkCenter} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="interval">Interval</Label>
              <Input id="interval" name="interval" value={formData.interval} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="taskType">Task Type</Label>
              <Input id="taskType" name="taskType" value={formData.taskType} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea id="taskDescription" name="taskDescription" value={formData.taskDescription} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="numberOfPerson">Number of Person</Label>
              <Input id="numberOfPerson" name="numberOfPerson" type="number" value={formData.numberOfPerson} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="manHour">Man Hour</Label>
              <Input id="manHour" name="manHour" type="number" value={formData.manHour} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="equipmentClassId">Equipment Class ID</Label>
              <Input id="equipmentClassId" name="equipmentClassId" value={formData.equipmentClassId} onChange={handleChange} />
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