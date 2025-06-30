"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from 'lucide-react';
import { useRouter } from "next/navigation";

const mockFailureModes = [
  {
    id: "1",
    description: "Seal leakage",
    riskRating: "high",
    rpn: 120,
    category: "Mechanical",
    severity: 8,
    probability: 5,
    detectability: 3,
  },
  {
    id: "2",
    description: "Bearing wear",
    riskRating: "medium",
    rpn: 60,
    category: "Mechanical",
    severity: 6,
    probability: 4,
    detectability: 2,
  },
  {
    id: "3",
    description: "Electrical short",
    riskRating: "critical",
    rpn: 200,
    category: "Electrical",
    severity: 10,
    probability: 7,
    detectability: 2,
  },
];

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

const FailureModeList: React.FC = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Failure Modes</h1>
        <Button onClick={() => router.push("/failure-modes/new")}>Add Failure Mode</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFailureModes.map((mode) => (
          <Card key={mode.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{mode.description}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getRiskColor(mode.riskRating)}>{mode.riskRating}</Badge>
                <Badge variant="outline">RPN: {mode.rpn}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Category: {mode.category}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <span>Severity: {mode.severity}</span>
                <span>Probability: {mode.probability}</span>
                <span>Detectability: {mode.detectability}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => router.push(`/failure-modes/${mode.id}`)}><Eye className="h-4 w-4" /></Button>
                <Button size="sm" onClick={() => router.push(`/failure-modes/${mode.id}/edit`)}><Edit className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FailureModeList; 