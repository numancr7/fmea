import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import EquipmentType from '@/models/EquipmentType';
import EquipmentTypeDetailClient from './EquipmentTypeDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

const EquipmentTypeDetail = async ({ params }: PageProps) => {
  const { id } = await params;
  
  await connectToDatabase();
  const equipmentType = await EquipmentType.findById(id).populate('equipmentClassId', 'name').lean();
  
  if (!equipmentType) {
    return (
      <div className="pt-20 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Equipment Type Not Found</h1>
          <Link href="/equipment-types">
            <Button className="mt-4">Back to Equipment Types</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Convert to plain object to avoid serialization issues
  const plainEquipmentType = JSON.parse(JSON.stringify(equipmentType));
  
  return <EquipmentTypeDetailClient equipmentType={plainEquipmentType} />;
};

export default EquipmentTypeDetail; 