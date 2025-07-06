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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
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
import type { FailureMode } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getRiskColor = (riskRating: string) => {
  switch (riskRating) {
    case 'critical':
      return 'bg-risk-critical text-white';
    case 'high':
      return 'bg-risk-high text-white';
    case 'medium':
      return 'bg-risk-medium text-white';
    case 'low':
      return 'bg-risk-low text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const FailureModeList: React.FC = () => {
  const { data: modeList = [], mutate } = useSWR<FailureMode[]>('/api/failure-modes', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/failure-modes/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        toast.success('Failure mode deleted successfully');
        mutate();
      } catch {
        toast.error('Failed to delete failure mode');
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Failure Modes</h1>
        <Link href="/failure-modes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Failure Mode
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>RPN</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modeList.map((mode: FailureMode) => (
              <TableRow key={mode._id}>
                <TableCell className="font-medium">{mode.name}</TableCell>
                <TableCell>{mode.rpn}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/failure-modes/${mode._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/failure-modes/${mode._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(mode._id as string)}
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
            <AlertDialogTitle>Are you sure you want to delete this failure mode?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the failure mode and all of its associated data.
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

export default FailureModeList; 