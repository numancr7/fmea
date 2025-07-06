"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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

interface EquipmentTypeDetailClientProps {
  equipmentType: any;
}

const EquipmentTypeDetailClient = ({ equipmentType }: EquipmentTypeDetailClientProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/equipment-types/${equipmentType._id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      toast({
        title: `Equipment type "${equipmentType.name}" has been deleted successfully`,
        description: 'Equipment type deleted successfully',
      });
      
      setShowDeleteDialog(false);
      router.push('/equipment-types');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete equipment type',
      });
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/equipment-types">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Equipment Types
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Equipment Type Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/equipment-types/${equipmentType._id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{equipmentType.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{equipmentType.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{equipmentType.description || 'No description provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Equipment Class</h3>
                <p className="mt-1">{equipmentType.equipmentClassId?.name || 'Not assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Systems Count</h3>
                <p className="mt-1">{equipmentType.systems?.length || 0}</p>
              </div>
            </div>

            {equipmentType.systems && equipmentType.systems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Systems</h3>
                <div className="space-y-3">
                  {equipmentType.systems.map((system: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <h4 className="font-medium">{system.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Components: {system.components?.length || 0}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this equipment type?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the equipment type
                and all associated data.
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
    </div>
  );
};

export default EquipmentTypeDetailClient; 