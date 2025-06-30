"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from 'lucide-react';
import { useRouter } from "next/navigation";

const mockProducts = [
  {
    id: "1",
    name: "Pump Oil",
    type: "Lubricant",
    manufacturer: "Acme Oil Co.",
  },
  {
    id: "2",
    name: "Compressor Belt",
    type: "Spare Part",
    manufacturer: "Beta Ltd",
  },
  {
    id: "3",
    name: "Control Panel",
    type: "Electrical",
    manufacturer: "PanelTech",
  },
];

const ProductList: React.FC = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => router.push("/products/new")}>Add Product</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <Card key={product.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Type: {product.type}</div>
              <div className="mb-2 text-sm text-muted-foreground">Manufacturer: {product.manufacturer}</div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => router.push(`/products/${product.id}`)}><Eye className="h-4 w-4" /></Button>
                <Button size="sm" onClick={() => router.push(`/products/${product.id}/edit`)}><Edit className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 