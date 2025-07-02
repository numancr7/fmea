"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';

const SparePartDetail = () => {
  const params = useParams();
  const id = params.id as string;
  
  // Mock spare part data
  const sparePart = {
    id: id || '1',
    name: 'Bearing Kit BK-45',
    partNumber: 'BK-45-001',
    manufacturer: 'BearingTech Inc.',
    description: 'Complete bearing kit for motor assembly M-452',
    category: 'Mechanical',
    stockQuantity: 15,
    minStockLevel: 5,
    unitPrice: 125.50,
    location: 'Warehouse A - Shelf B3',
    supplier: 'Industrial Supply Co.',
    lastRestocked: '2025-02-15',
    nextRestockDate: '2025-05-15',
    compatibleEquipment: ['Motor Assembly M-452', 'Pump XL450'],
    notes: 'High-demand item. Monitor stock levels closely.'
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= minLevel) {
      return <Badge className="bg-red-600">Low Stock</Badge>;
    } else if (quantity <= minLevel * 2) {
      return <Badge className="bg-amber-500">Medium Stock</Badge>;
    } else {
      return <Badge className="bg-green-600">In Stock</Badge>;
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/spare-parts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Spare Parts
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Spare Part Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/spare-parts/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Spare Part
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>{sparePart.name}</div>
                <div>{getStockStatus(sparePart.stockQuantity, sparePart.minStockLevel)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Part Number</h3>
                  <p className="mt-1">{sparePart.partNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
                  <p className="mt-1">{sparePart.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{sparePart.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock Quantity</h3>
                  <p className="mt-1">{sparePart.stockQuantity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Minimum Stock Level</h3>
                  <p className="mt-1">{sparePart.minStockLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unit Price</h3>
                  <p className="mt-1">${sparePart.unitPrice}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{sparePart.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                  <p className="mt-1">{sparePart.supplier}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Restocked</h3>
                  <p className="mt-1">{sparePart.lastRestocked}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Next Restock Date</h3>
                  <p className="mt-1">{sparePart.nextRestockDate}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{sparePart.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Compatible Equipment</h3>
                <ul className="mt-1 list-disc pl-5">
                  {sparePart.compatibleEquipment.map((equipment, index) => (
                    <li key={index}>{equipment}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1">{sparePart.notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SparePartDetail; 