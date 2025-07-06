"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ComponentForm from "@/components/ComponentForm";
import { Loader2 } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  description?: string;
  modules?: string[];
}

export default function EditComponentPage() {
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
        <div className="text-center text-red-600">
          {error || 'Component not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <ComponentForm component={component} isEditing={true} />
    </div>
  );
} 