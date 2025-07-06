"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from "sonner";
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
import type { EquipmentClass } from '@/types/models';

const EquipmentClassDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [equipmentClass, setEquipmentClass] = useState<EquipmentClass | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setFetching(true);
      setFetchError(null);
      fetch(`/api/equipment-classes/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Equipment class not found');
          return res.json();
        })
        .then(data => {
          setEquipmentClass(data);
          setFetching(false);
        })
        .catch(err => {
          setFetchError(err.message);
          setFetching(false);
        });
    }
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/equipment-classes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete equipment class');
      toast.success(`Equipment class "${equipmentClass?.name}" has been deleted successfully`);
      setShowDeleteDialog(false);
      router.push('/equipment-classes');
    } catch {
      toast.error('Failed to delete equipment class');
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/equipment-classes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Equipment Classes
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Equipment Class Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/equipment-classes/${id}/edit`}>
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

        {fetching ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : fetchError ? (
          <div className="p-8 text-center text-destructive">{fetchError}</div>
        ) : equipmentClass ? (
          <Card>
            <CardHeader>
              <CardTitle>{equipmentClass.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{equipmentClass.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{equipmentClass.description || 'No description provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Reviewed</h3>
                  <p className="mt-1">{equipmentClass.lastReviewed || 'Not reviewed yet'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reviewer List</h3>
                  <p className="mt-1">{equipmentClass.reviewerList || 'No reviewers assigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Engineering Discipline</h3>
                  <p className="mt-1">{equipmentClass.classEngineeringDiscipline || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this equipment class?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the equipment class
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

export default EquipmentClassDetail; 