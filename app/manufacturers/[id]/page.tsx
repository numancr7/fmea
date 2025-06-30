"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
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

const ManufacturerDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Mock manufacturer data
  const manufacturer = {
    id: id,
    name: 'FlowTech Industries',
    contactInfo: 'Phone: +1 (555) 123-4567 | Email: info@flowtech.com',
    website: 'https://www.flowtech.com'
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    toast.success(`Manufacturer "${manufacturer.name}" has been deleted successfully`);
    
    setShowDeleteDialog(false);
    router.push('/manufacturers');
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/manufacturers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Manufacturers
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manufacturer Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/manufacturers/${id}/edit`}>
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
            <CardTitle>{manufacturer.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{manufacturer.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <p className="mt-1">{manufacturer.contactInfo || 'No contact information provided'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                {manufacturer.website ? (
                  <a 
                    href={manufacturer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    {manufacturer.website}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                ) : (
                  <p className="mt-1">No website provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this manufacturer?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the manufacturer
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

export default ManufacturerDetail; 