"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
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
import type { SparePart } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'In Stock':
      return <Badge className="bg-green-600">In Stock</Badge>;
    case 'Low Stock':
      return <Badge className="bg-amber-500">Low Stock</Badge>;
    case 'Out of Stock':
      return <Badge variant="destructive">Out of Stock</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const SparePartList: React.FC = () => {
  const { data: spareParts = [], mutate } = useSWR<SparePart[]>('/api/spare-parts', fetcher);
  const { data: equipmentList = [] } = useSWR<any[]>('/api/equipment', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [partToDelete, setPartToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPartToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (partToDelete) {
      try {
        const res = await fetch(`/api/spare-parts/${partToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        toast({ title: 'Spare Part Deleted', description: 'Spare part deleted successfully' });
        mutate();
      } catch {
        toast({ title: 'Error', description: 'Failed to delete spare part' });
      } finally {
        setShowDeleteDialog(false);
        setPartToDelete(null);
      }
    }
  };

  const getEquipmentName = (id: string) => {
    return equipmentList.find((e: any) => e.id === id)?.name || 'Unknown Equipment';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spare Parts</h1>
        <Link href="/spare-parts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Spare Part
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Equipment Name</th>
              <th className="px-4 py-2 text-left">Material No.</th>
              <th className="px-4 py-2 text-left">Material Description</th>
              <th className="px-4 py-2 text-left">Stock (P/Min/Max)</th>
              <th className="px-4 py-2 text-left">Price (RM)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((part: SparePart) => (
              <tr key={part.id} className="border-b">
                <td className="px-4 py-2">{getEquipmentName(part.equipmentTypeIds[0])}</td>
                <td className="px-4 py-2 font-medium">{part.materialNo}</td>
                <td className="px-4 py-2">{part.description}</td>
                <td className="px-4 py-2">
                  {part.proposedStock < part.minStock ? (
                    <span className="text-red-600 font-medium">
                      {part.proposedStock}/{part.minStock}/{part.maxStock}
                    </span>
                  ) : (
                    <span>
                      {part.proposedStock}/{part.minStock}/{part.maxStock}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">RM {part.price}</td>
                <td className="px-4 py-2">{getStatusBadge(part.status)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link href={`/spare-parts/${part.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/spare-parts/${part.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(part.id)}
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
            <AlertDialogTitle>Are you sure you want to delete this spare part?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the spare part and all of its associated data.
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

export default SparePartList; 