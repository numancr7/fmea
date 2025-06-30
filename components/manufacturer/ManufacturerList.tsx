"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from 'lucide-react';
import { useRouter } from "next/navigation";

const mockManufacturers = [
  {
    id: "1",
    name: "Acme Corp",
    country: "USA",
  },
  {
    id: "2",
    name: "Beta Ltd",
    country: "UK",
  },
  {
    id: "3",
    name: "PanelTech",
    country: "Germany",
  },
];

const ManufacturerList: React.FC = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Manufacturers</h1>
        <Button onClick={() => router.push("/manufacturers/new")}>Add Manufacturer</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockManufacturers.map((manufacturer) => (
          <Card key={manufacturer.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{manufacturer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Country: {manufacturer.country}</div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => router.push(`/manufacturers/${manufacturer.id}`)}><Eye className="h-4 w-4" /></Button>
                <Button size="sm" onClick={() => router.push(`/manufacturers/${manufacturer.id}/edit`)}><Edit className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManufacturerList; 