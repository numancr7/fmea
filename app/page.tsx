"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Settings, AlertTriangle, Wrench, Shield, BarChart3, Users, Database, Box } from 'lucide-react';
import RiskMatrix from '@/components/dashboard/RiskMatrix';
import FailureModeSummary from '@/components/dashboard/FailureModeSummary';
import HighRiskItems from '@/components/dashboard/HighRiskItems';
import StatCard from '@/components/dashboard/StatCard';
import SparePartsStatus from '@/components/dashboard/SparePartsStatus';

const BeautifulLoader = ({ timedOut, error, onRetry }: { timedOut: boolean; error: boolean; onRetry: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
        <div className="absolute animate-pulse rounded-full h-16 w-16 border-4 border-indigo-400"></div>
        <div className="absolute animate-ping rounded-full h-8 w-8 bg-blue-400 opacity-75"></div>
      </div>
      <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 font-medium">
        {error ? (
          <span className="text-red-500 font-bold">Error: Failed to load session.<br/>Check your API, authentication configuration, or database connection.</span>
        ) : timedOut ? (
          <span className="text-red-500 font-bold">Error: Session loading timeout.<br/>Check your API and authentication configuration.</span>
        ) : 'Loading your dashboard...'}
      </p>
      {(error || timedOut) && (
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState(false);

  // Timeout fallback for loader
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'loading') {
      timer = setTimeout(() => setTimedOut(true), 8000); // 8 seconds
    }
    return () => clearTimeout(timer);
  }, [status]);

  // Detect error if session is still loading after timeout
  useEffect(() => {
    if (timedOut && status === 'loading') {
      setError(true);
    } else {
      setError(false);
    }
  }, [timedOut, status]);

  const handleRetry = () => {
    setTimedOut(false);
    setError(false);
    router.refresh();
  };

  if (status === "loading" || error || timedOut) {
    return <BeautifulLoader timedOut={timedOut} error={error} onRetry={handleRetry} />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center px-4 py-20">
        <div className="max-w-2xl w-full text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
            Welcome to FMEA Management System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Manage equipment, components, and risk assessments with advanced analytics and beautiful reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 shadow-md" onClick={() => router.push('/signup')}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
          <Card className="text-center shadow-xl border-0 bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Identify and assess potential failure modes with comprehensive risk analysis
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-xl border-0 bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Equipment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage equipment inventory, maintenance schedules, and component relationships
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-xl border-0 bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced analytics and reporting for data-driven decision making
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-xl border-0 bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Collaborative platform for teams to work together on FMEA projects
              </CardDescription>
            </CardContent>
          </Card>
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