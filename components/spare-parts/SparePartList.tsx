"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  manufacturer: string;
  quantity: number;
  minQuantity: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: string;
}

const SparePartList: React.FC = () => {
  const router = useRouter();
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpareParts();
  }, []);

  const loadSpareParts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: SparePart[] = [
        {
          id: '1',
          name: 'Bearing Assembly',
          partNumber: 'BRG-001',
          description: 'High-quality bearing assembly for industrial pumps',
          category: 'Bearings',
          manufacturer: 'Industrial Solutions Inc.',
          quantity: 15,
          minQuantity: 5,
          location: 'Warehouse A',
          status: 'In Stock',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Motor Controller',
          partNumber: 'MTR-002',
          description: 'Electronic motor controller for conveyor systems',
          category: 'Controllers',
          manufacturer: 'Precision Engineering Co.',
          quantity: 2,
          minQuantity: 3,
          location: 'Warehouse B',
          status: 'Low Stock',
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'Hydraulic Pump',
          partNumber: 'HYD-003',
          description: 'Hydraulic pump for heavy machinery',
          category: 'Pumps',
          manufacturer: 'Green Energy Systems',
          quantity: 0,
          minQuantity: 2,
          location: 'Warehouse A',
          status: 'Out of Stock',
          createdAt: '2024-01-25'
        }
      ];
      setSpareParts(mockData);
    } catch (error) {
      toast.error('Failed to load spare parts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      setSpareParts(prev => prev.filter(item => item.id !== id));
      toast.success('Spare part deleted successfully');
    } catch (error) {
      toast.error('Failed to delete spare part');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading spare parts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spare Parts</h1>
        <Link href="/spare-parts/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Spare Part
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {spareParts.map((sparePart) => (
          <Card key={sparePart.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{sparePart.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {sparePart.category}
                    </Badge>
                    <Badge className={getStatusColor(sparePart.status)}>
                      {sparePart.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/spare-parts/${sparePart.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Spare Part</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{sparePart.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(sparePart.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {sparePart.description}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Part Number:</strong> {sparePart.partNumber}</p>
                <p><strong>Manufacturer:</strong> {sparePart.manufacturer}</p>
                <p><strong>Quantity:</strong> {sparePart.quantity}/{sparePart.minQuantity}</p>
                <p><strong>Location:</strong> {sparePart.location}</p>
                <p><strong>Created:</strong> {sparePart.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {spareParts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No spare parts found</p>
          <Link href="/spare-parts/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create First Spare Part
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SparePartList; 