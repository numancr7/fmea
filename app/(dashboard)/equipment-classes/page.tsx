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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EquipmentClasses = () => {
  const { data: equipmentClasses = [], isLoading, mutate } = useSWR('/api/equipment-classes', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/equipment-classes/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete equipment class');
        toast({ title: 'Deleted', description: 'Equipment class deleted successfully' });
        mutate();
      } catch {
        toast({ title: 'Error', description: 'Failed to delete equipment class' });
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Classes</h1>
        <Link href="/equipment-classes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Equipment Class
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
            ) : equipmentClasses.length > 0 ? (
              equipmentClasses.map((equipment: Record<string, string | number | boolean | null | undefined>) => (
                <TableRow key={equipment.id as string}>
                  <TableCell className="font-medium">{equipment.name as string}</TableCell>
                  <TableCell>{(equipment.description as string) || (equipment.function as string) || 'No description'}</TableCell>
                  <TableCell>
                    <Badge className={getCriticalityColor(equipment.criticality as string)}>
                      {equipment.criticality as string}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/equipment-classes/${equipment.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/equipment-classes/${equipment.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteClick(equipment.id as string)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4}>No equipment classes found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-background rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Delete Equipment Class?</h2>
            <p className="mb-4">Are you sure you want to delete this equipment class? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentClasses; 
