"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EquipmentType {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  equipmentClassId: string | { _id: string; name: string };
  systems: any[];
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
      const res = await fetch('/api/equipment-types');
      if (!res.ok) throw new Error('Failed to fetch equipment types');
      const data = await res.json();
      setEquipmentTypes(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load equipment types' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/equipment-types/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete equipment type');
      setEquipmentTypes(prev => prev.filter(item => item.id !== id));
      toast({ title: 'Success', description: 'Equipment type deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete equipment type' });
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
          <Card key={equipmentType._id || equipmentType.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{equipmentType.name}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">ID: {equipmentType._id || equipmentType.id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Equipment Class: {typeof equipmentType.equipmentClassId === 'object' && equipmentType.equipmentClassId !== null
                      ? equipmentType.equipmentClassId.name
                      : equipmentType.equipmentClassId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Systems: {equipmentType.systems?.length ?? 0}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/equipment-types/${equipmentType._id || equipmentType.id}/edit`}>
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
                          onClick={() => handleDelete(equipmentType._id || equipmentType.id)}
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
                {equipmentType.description || 'No description provided'}
              </p>
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