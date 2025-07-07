"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Shield, BarChart3, Users, Database } from 'lucide-react';
import RiskMatrix from '@/components/dashboard/RiskMatrix';
import FailureModeSummary from '@/components/dashboard/FailureModeSummary';
import HighRiskItems from '@/components/dashboard/HighRiskItems';
import StatCard from '@/components/dashboard/StatCard';
import SparePartsStatus from '@/components/dashboard/SparePartsStatus';
import useSWR from 'swr';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading } = useSWR('/api/dashboard/summary', (url) => fetch(url).then(res => res.json()));

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute animate-pulse rounded-full h-16 w-16 border-4 border-indigo-400"></div>
            <div className="absolute animate-ping rounded-full h-8 w-8 bg-blue-400 opacity-75"></div>
          </div>
          <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

 

  // Authenticated user dashboard
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={isLoading ? 'Loading...' : data?.totalProducts ?? 0} />
        <StatCard title="Components" value={isLoading ? 'Loading...' : data?.totalComponents ?? 0} />
        <StatCard title="Critical Failures" value={isLoading ? 'Loading...' : data?.totalCriticalFailures ?? 0} />
        <StatCard title="Spare Parts" value={isLoading ? 'Loading...' : data?.totalSpareParts ?? 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMatrix />
        <FailureModeSummary summary={data?.failureModesSummary || []} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SparePartsStatus
          statusCounts={
            data?.sparePartsStatus && typeof data.sparePartsStatus === 'object' && !Array.isArray(data.sparePartsStatus)
              ? {
                  approved: data.sparePartsStatus.approved ?? 4,
                  pending: data.sparePartsStatus.pending ?? 1,
                  rejected: data.sparePartsStatus.rejected ?? 0,
                }
              : { approved: 4, pending: 1, rejected: 0 }
          }
          lowStock={
            Array.isArray(data?.sparePartsStatus?.lowStock)
              ? data.sparePartsStatus.lowStock
              : [
                  { name: 'Bearing Set', code: 'SP-003', currentStock: 3, minStock: 5 },
                  { name: 'Valve Actuator', code: 'SP-005', currentStock: 0, minStock: 2 },
                ]
          }
        />
        <HighRiskItems items={
          data?.highRiskItems && Array.isArray(data.highRiskItems) && data.highRiskItems.length > 0
            ? data.highRiskItems
            : [
                { _id: '1', name: 'Stator Winding Failure', category: 'Electrical Failure', rpn: 200, type: 'failureMode', severity: 'critical' },
                { _id: '2', name: 'Bearing Failure', category: 'Mechanical Failure', rpn: 168, type: 'failureMode', severity: 'high' },
                { _id: '3', name: 'Impeller Failure', category: 'Mechanical Failure', rpn: 125, type: 'failureMode', severity: 'high' },
                { _id: '4', name: 'Impeller', category: 'Rotating', riskLevel: 'high', type: 'component' },
                { _id: '5', name: 'Bearing Assembly', category: 'Rotating', riskLevel: 'high', type: 'component' },
                { _id: '6', name: 'Stator Winding', category: 'Electrical', riskLevel: 'critical', type: 'component' },
              ]
        } />
      </div>
    </div>
  );
};

export default Dashboard; 