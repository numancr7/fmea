"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getRiskColor = (riskRating: string) => {
  switch (riskRating) {
    case 'critical':
      return 'bg-risk-critical text-white';
    case 'high':
      return 'bg-risk-high text-white';
    case 'medium':
      return 'bg-risk-medium text-white';
    case 'low':
      return 'bg-risk-low text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const FailureModeDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: failureMode } = useSWR(id ? `/api/failure-modes/${id}` : null, fetcher);

  if (!failureMode) return <div className="p-8">Loading...</div>;

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/failure-modes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Failure Modes
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Failure Mode Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/failure-modes/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Failure Mode
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>{failureMode.description || '-'}</div>
                <div>
                  <Badge className={getRiskColor(failureMode.riskRating)}>
                    {failureMode.riskRating || '-'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{failureMode.category || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">RPN</h3>
                  <p className="mt-1">{failureMode.rpn || '-'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Severity</h3>
                <p className="mt-1">{failureMode.severity || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Probability</h3>
                <p className="mt-1">{failureMode.probability || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Detectability</h3>
                <p className="mt-1">{failureMode.detectability || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1">{failureMode.notes || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FailureModeDetail; 