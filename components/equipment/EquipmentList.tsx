"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const mockEquipment = [
  {
    id: "1",
    name: "Pump A",
    type: "Centrifugal Pump",
    manufacturer: "Acme Corp",
    status: "Operational",
  },
  {
    id: "2",
    name: "Compressor B",
    type: "Air Compressor",
    manufacturer: "Beta Ltd",
    status: "Maintenance",
  },
  {
    id: "3",
    name: "Valve C",
    type: "Control Valve",
    manufacturer: "ValveTech",
    status: "Out of Service",
  },
];

const EquipmentList: React.FC = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Equipment</h1>
        <Button onClick={() => router.push("/equipment/new")}>Add Equipment</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEquipment.map((eq) => (
          <Card key={eq.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{eq.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Type: {eq.type}</div>
              <div className="mb-2 text-sm text-muted-foreground">Manufacturer: {eq.manufacturer}</div>
              <div className="mb-2 text-sm">Status: <span className="font-semibold">{eq.status}</span></div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => router.push(`/equipment/${eq.id}`)}>View</Button>
                <Button size="sm" onClick={() => router.push(`/equipment/${eq.id}/edit`)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList; 