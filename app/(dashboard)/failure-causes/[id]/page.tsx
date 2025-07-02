"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from 'lucide-react';

const FailureCauseDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  
  // Mock failure cause data
  const failureCause = {
    id: id,
    name: 'Poor maintenance',
    description: 'Inadequate maintenance procedures leading to equipment degradation and failure.'
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/failure-causes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Failure Causes
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Failure Cause Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/failure-causes/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{failureCause.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{failureCause.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{failureCause.description || 'No description provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FailureCauseDetail; 