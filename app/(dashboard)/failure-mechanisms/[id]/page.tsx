"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const FailureMechanismDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: failureMechanism } = useSWR(id ? `/api/failure-mechanisms/${id}` : null, fetcher);

  if (!failureMechanism) return <div className="p-8">Loading...</div>;

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/failure-mechanisms">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Failure Mechanisms
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Failure Mechanism Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/failure-mechanisms/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Mechanism Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="font-medium">Name:</span> {failureMechanism.name}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FailureMechanismDetail; 