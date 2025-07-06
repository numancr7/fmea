"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Button } from "@/components/ui/button";
import { PanelLeft, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!session?.user);
  }, [session]);

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/about', '/contact'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  // Show sidebar only for authenticated users on non-public routes
  const shouldShowSidebar = isAuthenticated && !isPublicRoute;

  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);
      if (isMobileNow) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle redirect for unauthenticated users on protected routes
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute && !(status === "loading")) {
      router.push('/login');
    }
  }, [isAuthenticated, isPublicRoute, status, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // For public routes, render without sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    );
  }

  // For authenticated routes, render with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        <main className={`flex-1 ${shouldShowSidebar ? 'ml-64' : ''} pt-16`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout; 