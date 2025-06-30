"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';

const FailureModeDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  
  // Mock failure mode data
  const failureMode = {
    id: id || '1',
    name: 'Motor Overheating',
    description: 'Motor temperature exceeds normal operating parameters',
    component: 'Motor Assembly M-452',
    failureMechanism: 'Inadequate cooling, excessive load, or bearing failure',
    effect: 'Reduced motor efficiency, potential damage to windings, eventual motor failure',
    severity: 'High',
    probability: 'Medium',
    detection: 'Low',
    riskPriorityNumber: '12',
    mitigationTasks: 'Regular temperature monitoring, cooling system inspection',
    notes: 'Install temperature sensors for continuous monitoring'
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-red-700">Critical</Badge>;
      case 'High':
        return <Badge className="bg-red-600">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-600">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
                <div>{failureMode.name}</div>
                <div>{getSeverityBadge(failureMode.severity)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{failureMode.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Associated Component</h3>
                  <p className="mt-1">{failureMode.component}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Severity</h3>
                  <p className="mt-1">{failureMode.severity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Probability</h3>
                  <p className="mt-1">{failureMode.probability}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Detection</h3>
                  <p className="mt-1">{failureMode.detection}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Risk Priority Number (RPN)</h3>
                  <p className="mt-1">{failureMode.riskPriorityNumber}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Failure Mechanism</h3>
                <p className="mt-1">{failureMode.failureMechanism}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Effect</h3>
                <p className="mt-1">{failureMode.effect}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mitigation Tasks</h3>
                <p className="mt-1">{failureMode.mitigationTasks}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1">{failureMode.notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FailureModeDetail; 