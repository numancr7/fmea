"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';
import type { MainProduct } from '@/types/models';

const ProductDetail = () => {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<MainProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/main-products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/products">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Badge className="ml-3" variant={product.riskRating === 'high' ? 'destructive' : 'default'}>
            {product.riskRating}
          </Badge>
        </div>
        <Link href={`/products/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div>{product.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Equipment Type ID</div>
              <div>{product.equipmentTypeId}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Risk Rating</div>
              <div>{product.riskRating}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Probability</div>
              <div>{product.probability}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components & Failure Modes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Components</div>
              <div>{product.componentIds?.length || 0} components</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Failure Modes</div>
              <div>{product.failureModeIds?.length || 0} failure modes</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail; 