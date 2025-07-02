"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';

const EquipmentDetail = () => {
  const params = useParams();
  const id = params.id as string;
  
  // Mock equipment data
  const equipment = {
    id: id || '1',
    name: 'Industrial Pump XL450',
    type: 'Centrifugal Pump',
    class: 'Heavy Duty',
    manufacturer: 'FlowTech Industries',
    model: 'XL450',
    serialNumber: 'FT-450-78921',
    location: 'Building C - Processing Unit',
    installationDate: '2024-02-15',
    status: 'Operational',
    criticality: 'High',
    lastInspection: '2025-03-10',
    nextInspection: '2025-06-10',
    notes: 'Regular maintenance required every 3 months.'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Operational':
        return <Badge className="bg-green-600">Operational</Badge>;
      case 'Maintenance':
        return <Badge className="bg-amber-500">Maintenance</Badge>;
      case 'Out of Service':
        return <Badge className="bg-red-600">Out of Service</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/equipment">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Equipment
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Equipment Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/equipment/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Equipment
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>{equipment.name}</div>
                <div>{getStatusBadge(equipment.status)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Equipment Type</h3>
                  <p className="mt-1">{equipment.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Equipment Class</h3>
                  <p className="mt-1">{equipment.class}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
                  <p className="mt-1">{equipment.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Model</h3>
                  <p className="mt-1">{equipment.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                  <p className="mt-1">{equipment.serialNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{equipment.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Installation Date</h3>
                  <p className="mt-1">{equipment.installationDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Criticality</h3>
                  <p className="mt-1">{equipment.criticality}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Inspection</h3>
                  <p className="mt-1">{equipment.lastInspection}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Next Inspection</h3>
                  <p className="mt-1">{equipment.nextInspection}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1">{equipment.notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail; 