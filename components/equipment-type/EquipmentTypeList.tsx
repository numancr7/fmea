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
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";
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
import type { EquipmentType, EquipmentClass } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EquipmentTypeList: React.FC = () => {
  const { data: equipmentTypes = [], isLoading, mutate } = useSWR<EquipmentType[]>('/api/equipment-types', fetcher);
  const { data: equipmentClasses = [] } = useSWR<EquipmentClass[]>('/api/equipment-classes', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const getEquipmentClassName = (classId: string) => {
    if (!classId) return 'N/A';
    const found = equipmentClasses.find((c: EquipmentClass) => c.id === classId || c.id === classId);
    return found ? found.name : 'N/A';
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/equipment-types/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete equipment boundary');
        toast({ title: 'Success', description: 'Equipment boundary deleted successfully' });
        mutate();
      } catch {
        toast({ title: 'Error', description: 'Failed to delete equipment boundary' });
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Boundaries</h1>
        <Link href="/equipment-types/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Equipment Boundary
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Equipment Class</TableHead>
              <TableHead>Systems</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : equipmentTypes.length > 0 ? (
              equipmentTypes.map((equipmentType: any, index: number) => (
                <TableRow key={equipmentType._id || `equipment-type-${index}`}>
                  <TableCell className="font-medium">{equipmentType.name}</TableCell>
                  <TableCell>{equipmentType.description || 'No description'}</TableCell>
                  <TableCell>{getEquipmentClassName(equipmentType.equipmentClassId?._id || equipmentType.equipmentClassId || '')}</TableCell>
                  <TableCell>{equipmentType.systems?.length ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/equipment-types/${equipmentType._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/equipment-types/${equipmentType._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteClick(equipmentType._id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5}>No equipment boundaries found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this equipment boundary?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment boundary and remove it from all equipment mappings.
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

export default EquipmentTypeList; 