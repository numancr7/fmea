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

const mockFailureMechanisms = [
  { id: '1', name: 'Inadequate cooling' },
  { id: '2', name: 'Excessive load' },
  { id: '3', name: 'Bearing failure' },
  { id: '4', name: 'Power loss' },
  { id: '5', name: 'Corrosion' }
];

const FailureMechanismList: React.FC = () => {
  const [mechanismList, setMechanismList] = useState(mockFailureMechanisms);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const itemName = mechanismList.find(m => m.id === itemToDelete)?.name || 'Failure Mechanism';
      setMechanismList(mechanismList.filter(item => item.id !== itemToDelete));
      toast.success({ title: 'Success', description: `${itemName} has been deleted successfully` });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Failure Mechanisms</h1>
        <Link href="/failure-mechanisms/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Failure Mechanism
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanismList.map((mechanism) => (
              <TableRow key={mechanism.id}>
                <TableCell className="font-medium">{mechanism.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/failure-mechanisms/${mechanism.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/failure-mechanisms/${mechanism.id}/edit`}>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(mechanism.id)}
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
            <AlertDialogTitle>Are you sure you want to delete this failure mechanism?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the failure mechanism.
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

export default FailureMechanismList; 