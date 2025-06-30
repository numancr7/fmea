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

interface EquipmentType {
  id: string;
  name: string;
  description: string;
  category: string;
  specifications: string;
  createdAt: string;
}

const EquipmentTypeList: React.FC = () => {
  const router = useRouter();
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipmentTypes();
  }, []);

  const loadEquipmentTypes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: EquipmentType[] = [
        {
          id: '1',
          name: 'Industrial Pump',
          description: 'High-performance industrial pump for heavy-duty applications',
          category: 'Industrial',
          specifications: 'Flow rate: 1000 L/min, Pressure: 50 bar',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Conveyor Belt',
          description: 'Automated conveyor system for material handling',
          category: 'Manufacturing',
          specifications: 'Length: 50m, Speed: 2 m/s, Load capacity: 500kg',
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'HVAC System',
          description: 'Heating, ventilation, and air conditioning system',
          category: 'Building',
          specifications: 'Cooling capacity: 10kW, Heating capacity: 12kW',
          createdAt: '2024-01-25'
        }
      ];
      setEquipmentTypes(mockData);
    } catch (error) {
      toast.error('Failed to load equipment types');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      setEquipmentTypes(prev => prev.filter(item => item.id !== id));
      toast.success('Equipment type deleted successfully');
    } catch (error) {
      toast.error('Failed to delete equipment type');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading equipment types...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Equipment Types</h1>
        <Link href="/equipment-types/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Equipment Type
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {equipmentTypes.map((equipmentType) => (
          <Card key={equipmentType.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{equipmentType.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {equipmentType.category}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/equipment-types/${equipmentType.id}/edit`}>
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
                        <AlertDialogTitle>Delete Equipment Type</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{equipmentType.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(equipmentType.id)}
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
                {equipmentType.description}
              </p>
              <div className="text-xs text-gray-500">
                <p><strong>Specifications:</strong> {equipmentType.specifications}</p>
                <p className="mt-1">Created: {equipmentType.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipmentTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No equipment types found</p>
          <Link href="/equipment-types/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create First Equipment Type
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EquipmentTypeList; 