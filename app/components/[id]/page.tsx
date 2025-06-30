"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';

const ComponentDetail = () => {
  const params = useParams();
  const id = params.id as string;
  
  // Mock component data - in a real app, you would fetch this based on the ID
  const component = {
    id: id || '1',
    name: 'Motor Assembly M-452',
    description: 'High-efficiency electric motor assembly for XL pumps with advanced cooling system for extended operation.',
    type: 'Motor',
    manufacturer: 'ElectroPower Inc.',
    model: 'M-452',
    serialNumber: 'EP-M452-98765',
    criticality: 'High',
    parentProduct: 'Industrial Pump XL450',
    installationDate: '2024-02-15',
    lastInspection: '2025-03-10',
    nextInspection: '2025-06-10',
    relatedFailureModes: ['Motor Overheating', 'Bearing Failure', 'Power Loss'],
    relatedSpareParts: ['Bearing Kit BK-45', 'Motor Cooling Fan MCF-12', 'Control Circuit CC-890'],
    notes: 'Requires specialized lubricant MX-500. Inspection every 3 months.'
  };

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case 'High':
        return <Badge className="bg-red-600">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-600">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/components">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Components
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Component Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/components/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Component
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>{component.name}</div>
                <div>{getCriticalityBadge(component.criticality)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{component.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{component.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
                  <p className="mt-1">{component.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Model</h3>
                  <p className="mt-1">{component.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                  <p className="mt-1">{component.serialNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parent Product</h3>
                  <p className="mt-1">{component.parentProduct}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Installation Date</h3>
                  <p className="mt-1">{component.installationDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Inspection</h3>
                  <p className="mt-1">{component.lastInspection}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Next Inspection</h3>
                  <p className="mt-1">{component.nextInspection}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Related Failure Modes</h3>
                <ul className="mt-1 list-disc pl-5">
                  {component.relatedFailureModes.map((mode, index) => (
                    <li key={index}>{mode}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Related Spare Parts</h3>
                <ul className="mt-1 list-disc pl-5">
                  {component.relatedSpareParts.map((part, index) => (
                    <li key={index}>{part}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1">{component.notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail; 