"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import useSWR from 'swr';
import type { MainProduct } from '@/types/models';
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductList = () => {
  const { data: products = [], error, isLoading, mutate } = useSWR<MainProduct[]>('/api/main-products', fetcher);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/main-products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Product deleted successfully');
      mutate();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load products.</div>;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <Button asChild>
          <Link href="/products/new">Add Product</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Equipment Type</th>
              <th className="px-4 py-2 text-left">Components</th>
              <th className="px-4 py-2 text-left">Risk Rating</th>
              <th className="px-4 py-2 text-left">Probability</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: MainProduct) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">{product.name || '-'}</td>
                <td className="px-4 py-2">{product.equipmentTypeId || '-'}</td>
                <td className="px-4 py-2">{Array.isArray(product.componentIds) ? product.componentIds.length : '-'}</td>
                <td className="px-4 py-2">
                  {product.riskRating ? (
                    <Badge className={
                      product.riskRating === 'low' ? 'bg-green-400' :
                      product.riskRating === 'medium' ? 'bg-yellow-400 text-black' :
                      product.riskRating === 'high' ? 'bg-red-400' :
                      product.riskRating === 'critical' ? 'bg-red-900' :
                      'bg-gray-400'
                    }>
                      {product.riskRating}
                    </Badge>
                  ) : '-'}
                </td>
                <td className="px-4 py-2">{product.probability || '-'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}`}><Eye className="h-4 w-4" /></Link>
                    <Link href={`/products/${product.id}/edit`}><Edit className="h-4 w-4" /></Link>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProductList; 