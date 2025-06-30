"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FailureMode {
  id: string;
  name: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  frequency: number;
  lastOccurrence: string;
}

const riskLevels = [
    { level: 'Critical', count: 1, color: 'bg-red-800' },
    { level: 'High', count: 2, color: 'bg-red-600' },
    { level: 'Medium', count: 2, color: 'bg-yellow-500' },
];

const categories = [
    { name: 'Mechanical', count: 2, color: 'bg-blue-500' },
    { name: 'Electrical', count: 1, color: 'bg-purple-500' },
    { name: 'Operational', count: 2, color: 'bg-green-500' },
];

const FailureModeSummary = () => {
  // Replace with your actual data logic
  const failureModes = [
    { category: 'Mechanical', riskRating: 'high' as 'low' | 'medium' | 'high' | 'critical' },
    { category: 'Sealing', riskRating: 'high' as 'low' | 'medium' | 'high' | 'critical' },
    { category: 'Electrical', riskRating: 'critical' as 'low' | 'medium' | 'high' | 'critical' },
    { category: 'Control', riskRating: 'medium' as 'low' | 'medium' | 'high' | 'critical' },
    { category: 'Mechanical', riskRating: 'medium' as 'low' | 'medium' | 'high' | 'critical' },
  ];

  const categoryCounts = failureModes.reduce((acc, mode) => {
    acc[mode.category] = (acc[mode.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  failureModes.forEach(mode => { riskCounts[mode.riskRating as keyof typeof riskCounts]++; });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Failure Mode Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-md">
            <div className="text-2xl font-bold">{failureModes.length}</div>
            <div className="text-sm text-muted-foreground">Total Failure Modes</div>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <div className="text-2xl font-bold">{riskCounts.high + riskCounts.critical}</div>
            <div className="text-sm text-muted-foreground">High/Critical Risk</div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-medium">By Risk Level</h4>
          <div className="flex gap-1 h-8">
            {riskCounts.critical > 0 && (
              <div className="bg-red-800 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.critical / failureModes.length) * 100}%` }}>{riskCounts.critical}</div>
            )}
            {riskCounts.high > 0 && (
              <div className="bg-red-600 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.high / failureModes.length) * 100}%` }}>{riskCounts.high}</div>
            )}
            {riskCounts.medium > 0 && (
              <div className="bg-yellow-500 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.medium / failureModes.length) * 100}%` }}>{riskCounts.medium}</div>
            )}
            {riskCounts.low > 0 && (
              <div className="bg-green-700 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.low / failureModes.length) * 100}%` }}>{riskCounts.low}</div>
            )}
          </div>
          <h4 className="text-sm font-medium mt-4">By Category</h4>
          <ul className="flex gap-1 h-8">
            {Object.keys(categoryCounts).map((category) => (
              <li key={category} className="bg-primary/20 text-primary text-xs flex items-center justify-center px-2 rounded-md">
                {categoryCounts[category]}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FailureModeSummary; 