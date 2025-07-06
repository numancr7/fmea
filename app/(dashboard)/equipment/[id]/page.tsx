"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';
import type { Equipment, EquipmentType, EquipmentClass, Manufacturer, EquipmentFunction } from '@/types/models';

const EquipmentDetail = () => {
  const params = useParams();
  const id = params.id as string;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [equipmentType, setEquipmentType] = useState<EquipmentType | null>(null);
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [equipmentClass, setEquipmentClass] = useState<EquipmentClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const eqRes = await fetch(`/api/equipment/${id}`);
      if (!eqRes.ok) return setLoading(false);
      const eq = await eqRes.json();
      setEquipment(eq);
      // Fetch related data
      const [typesRes, classesRes, mansRes] = await Promise.all([
        fetch('/api/equipment-types'),
        fetch('/api/equipment-classes'),
        fetch('/api/manufacturers'),
      ]);
      const [types, classes, mans] = await Promise.all([
        typesRes.json(),
        classesRes.json(),
        mansRes.json(),
      ]);
      setEquipmentType(types.find((t: EquipmentType) => t.id === eq.equipmentType) || null);
      setEquipmentClass(classes.find((c: EquipmentClass) => c.id === eq.equipmentClass) || null);
      setManufacturer(mans.find((m: Manufacturer) => m.id === eq.manufacturer) || null);
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Equipment not found</h2>
        <Link href="/equipment">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Equipment List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/equipment">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{equipment.equipmentDescription}</h1>
          <Badge className="ml-3" variant={equipment.criticality === 'high' ? 'destructive' : 'default'}>
            {equipment.criticality}
          </Badge>
        </div>
        <Link href={`/equipment/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Equipment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Equipment No.</div>
              <div>{equipment.equipmentNoFromSAP || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Description</div>
              <div>{equipment.equipmentDescription || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Equipment Class</div>
              <div>{equipmentClass?.name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Equipment Type</div>
              <div>{equipmentType?.name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
              <div>{manufacturer?.name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <div>{equipment.model || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">SCE</div>
              <div>{equipment.sce || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Criticality</div>
              <div>{equipment.criticality || 'N/A'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Area</div>
              <div>{equipment.area || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Unit</div>
              <div>{equipment.unit || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Number of Units</div>
              <div>{equipment.numberOfUnits || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Functional Location</div>
              <div>{equipment.functionalLocation || 'N/A'}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium text-muted-foreground">SAP Information</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Functional Location from SAP</div>
                  <div>{equipment.functionalLocationFromSAP || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">TechIdent No. from SAP</div>
                  <div>{equipment.techIdentNoFromSAP || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Functional Location Description from SAP</div>
                  <div className="p-2 bg-muted/20 rounded-md mt-1">{equipment.functionalLocationDescriptionFromSAP || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Equipment Description from SAP</div>
                  <div className="p-2 bg-muted/20 rounded-md mt-1">{equipment.equipmentDescriptionFromSAP || 'N/A'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Equipment Functions</CardTitle>
        </CardHeader>
        <CardContent>
          {equipment.equipmentFunctions && equipment.equipmentFunctions.length > 0 ? (
            <ul className="list-disc pl-6">
              {equipment.equipmentFunctions.map((func) => {
                const f = func as EquipmentFunction;
                return <li key={f.id}>{f.description}</li>;
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground">No functions defined for this equipment</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetail; 