"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface Manufacturer {
  id: string;
  name: string;
  contactInfo?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ManufacturerDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const fetchManufacturer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/manufacturers/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Manufacturer not found');
          } else {
            setError('Failed to fetch manufacturer');
          }
          return;
        }
        
        const data = await response.json();
        setManufacturer(data);
      } catch (err) {
        setError('Failed to fetch manufacturer');
        console.error('Error fetching manufacturer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchManufacturer();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch(`/api/manufacturers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete manufacturer');
      }

      toast({
        title: "Manufacturer Deleted",
        description: `Manufacturer "${manufacturer?.name}" has been deleted successfully`,
      });
      
      router.push('/manufacturers');
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete manufacturer',
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading manufacturer...</span>
        </div>
      </div>
    );
  }

  if (error || !manufacturer) {
    return (
      <div className="pt-20 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/manufacturers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Manufacturers
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manufacturer Details</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                {error || 'Manufacturer not found'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
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
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              {manufacturer.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{new Date(manufacturer.createdAt).toLocaleDateString()}</p>
                </div>
              )}
              {manufacturer.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{new Date(manufacturer.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerDetail; 