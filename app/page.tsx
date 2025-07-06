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

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
        <StatCard title="Total Products" value="24" trend={{ value: "12", positive: true }} />
        <StatCard title="Components" value="156" trend={{ value: "8", positive: true }} />
        <StatCard title="Critical Failures" value="7" trend={{ value: "3", positive: false }} />
        <StatCard title="Spare Parts" value="43" trend={{ value: "15", positive: true }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMatrix />
        <FailureModeSummary />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SparePartsStatus />
        <HighRiskItems />
      </div>
    </div>
  );
};

export default Dashboard; 