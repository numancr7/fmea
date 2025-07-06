"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
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
import type { FailureCause } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const FailureCauseList: React.FC = () => {
  const { data: causeList = [], mutate } = useSWR<FailureCause[]>('/api/failure-causes', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/failure-causes/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        toast.success('Failure cause deleted successfully');
        mutate();
      } catch {
        toast.error('Failed to delete failure cause');
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Failure Causes</h1>
        <Link href="/failure-causes/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Failure Cause
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cause Name</TableHead>
              <TableHead>Cause Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {causeList.map((cause: FailureCause) => (
              <TableRow key={cause.id}>
                <TableCell className="font-medium">{cause.causeName}</TableCell>
                <TableCell>{cause.causeCode || '-'}</TableCell>
                <TableCell>{cause.causeDescription || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/failure-causes/${cause.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> View</Button>
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