"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FailureModeSummaryProps {
  summary?: {
    total?: number;
    byRiskLevel?: Record<string, number>;
    byCategory?: Record<string, number>;
    highCritical?: number;
  };
}

const FailureModeSummary = ({ summary = {} }: FailureModeSummaryProps) => {
  const total = summary.total || 0;
  const riskCounts = summary.byRiskLevel || { low: 0, medium: 0, high: 0, critical: 0 };
  const categoryCounts = summary.byCategory || {};
  const highCritical = summary.highCritical || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Failure Mode Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-md">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">Total Failure Modes</div>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <div className="text-2xl font-bold">{highCritical}</div>
            <div className="text-sm text-muted-foreground">High/Critical Risk</div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-medium">By Risk Level</h4>
          <div className="flex gap-1 h-8">
            {riskCounts.critical > 0 && (
              <div className="bg-red-800 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.critical / total) * 100}%` }}>{riskCounts.critical}</div>
            )}
            {riskCounts.high > 0 && (
              <div className="bg-red-600 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.high / total) * 100}%` }}>{riskCounts.high}</div>
            )}
            {riskCounts.medium > 0 && (
              <div className="bg-yellow-500 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.medium / total) * 100}%` }}>{riskCounts.medium}</div>
            )}
            {riskCounts.low > 0 && (
              <div className="bg-green-700 text-white text-xs flex items-center justify-center px-2" style={{ width: `${(riskCounts.low / total) * 100}%` }}>{riskCounts.low}</div>
            )}
          </div>
          <h4 className="text-sm font-medium mt-4">By Category</h4>
          <ul className="flex gap-1 h-8">
            {Object.keys(categoryCounts).map((category) => (
              <li key={category} className="bg-primary/20 text-primary text-xs flex items-center justify-center px-2 rounded-md">
                {category}: {categoryCounts[category]}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FailureModeSummary; 