"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
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

const mockFailureCauses = [
  { id: '1', name: 'Poor maintenance', description: 'Inadequate maintenance procedures' },
  { id: '2', name: 'Operator error', description: 'Human error during operation' },
  { id: '3', name: 'Design flaw', description: 'Inherent design issues' },
  { id: '4', name: 'Material fatigue', description: 'Material degradation over time' },
  { id: '5', name: 'Environmental factors', description: 'External environmental conditions' }
];

const FailureCauseList: React.FC = () => {
  const [causeList, setCauseList] = useState(mockFailureCauses);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const itemName = causeList.find(c => c.id === itemToDelete)?.name || 'Failure Cause';
      setCauseList(causeList.filter(item => item.id !== itemToDelete));
      toast.success({ title: 'Success', description: `${itemName} has been deleted successfully` });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Failure Causes</h1>
        <Link href="/failure-causes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Failure Cause
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {causeList.map((cause) => (
              <TableRow key={cause.id}>
                <TableCell className="font-medium">{cause.name}</TableCell>
                <TableCell>{cause.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/failure-causes/${cause.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/failure-causes/${cause.id}/edit`}>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(cause.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this failure cause?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the failure cause.
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

export default FailureCauseList; 