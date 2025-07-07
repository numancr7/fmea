"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const FailureCauseDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: failureCause } = useSWR(id ? `/api/failure-causes/${id}` : null, fetcher);

  if (!failureCause) return <div className="p-8">Loading...</div>;

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
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Cause Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="font-medium">Name:</span> {failureCause.causeName}
            </div>
            <div>
              <span className="font-medium">Code:</span> {failureCause.causeCode}
            </div>
            <div>
              <span className="font-medium">Description:</span> {failureCause.causeDescription}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FailureCauseDetail; 