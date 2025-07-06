"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Task } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TaskList = () => {
  const { data: taskList = [], mutate } = useSWR<Task[]>('/api/tasks', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/tasks/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        toast.success('Task deleted successfully');
        mutate();
      } catch {
        toast.error('Failed to delete task');
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  const getTaskTypeBadgeVariant = (taskType: string) => {
    switch (taskType) {
      case 'PM':
        return 'default';
      case 'PPM':
        return 'secondary';
      case 'CM':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/tasks/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Task List</th>
              <th className="px-4 py-2 text-left font-medium">SAP GTL</th>
              <th className="px-4 py-2 text-left font-medium">Work Center</th>
              <th className="px-4 py-2 text-left font-medium">Interval</th>
              <th className="px-4 py-2 text-left font-medium">Task Type</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-left font-medium">Personnel</th>
              <th className="px-4 py-2 text-left font-medium">Man Hours</th>
              <th className="px-4 py-2 text-left font-medium">Equipment Class</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((item: Task) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 font-medium">{item.taskList}</td>
                <td className="px-4 py-2">{item.sapGTL}</td>
                <td className="px-4 py-2">{item.mainWorkCenter}</td>
                <td className="px-4 py-2">{item.interval}</td>
                <td className="px-4 py-2">
                  <Badge className={getTaskTypeBadgeVariant(item.taskType)}>
                    {item.taskType}
                  </Badge>
                </td>
                <td className="px-4 py-2">{item.taskDescription}</td>
                <td className="px-4 py-2">{item.numberOfPerson}</td>
                <td className="px-4 py-2">{item.manHour}</td>
                <td className="px-4 py-2">{item.equipmentClassId}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link href={`/tasks/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/tasks/${item.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(item.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList; 
