"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  description?: string;
  modules?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const ComponentDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/components/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Component not found');
          } else {
            setError('Failed to fetch component');
          }
          return;
        }
        
        const data = await response.json();
        setComponent(data);
      } catch (err) {
        setError('Failed to fetch component');
        console.error('Error fetching component:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComponent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading component...</span>
        </div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="pt-20 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/components">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Components
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Component Details</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                {error || 'Component not found'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <CardTitle>{component.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{component.description || 'No description available'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Component ID</h3>
                  <p className="mt-1">{component.id}</p>
                </div>
                {component.createdAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1">{new Date(component.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
                {component.updatedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1">{new Date(component.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {component.modules && component.modules.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Modules</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {component.modules.map((module, index) => (
                      <Badge key={index} variant="secondary">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail; 