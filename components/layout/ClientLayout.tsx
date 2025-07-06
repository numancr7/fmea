"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Button } from "@/components/ui/button";
import { PanelLeft } from 'lucide-react';
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
  
  // Define public routes that don't require authentication
  const publicRoutes = [ '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const shouldShowSidebar = isAuthenticated && !isPublicRoute;
  
  // Debug log
  console.log('pathname:', pathname, 'isAuthenticated:', isAuthenticated, 'isPublicRoute:', isPublicRoute, 'shouldShowSidebar:', shouldShowSidebar);
  
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
    if (!isAuthenticated && !isPublicRoute && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isPublicRoute, isLoading, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // For public routes, show a simple layout without sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 max-w-none">
        {children}
      </div>
    );
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For authenticated users, show full layout with sidebar
  if (shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="flex relative flex-1">
          {/* Sidebar (desktop) */}
          {!isMobile && sidebarOpen && (
            <div className="fixed top-0 left-0 z-30 w-64 pt-16 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg">
              <Sidebar />
            </div>
          )}
          {/* Sidebar (mobile overlay) */}
          {isMobile && sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              <div className="w-64 pt-16 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg">
                <Sidebar />
              </div>
              <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
            </div>
          )}
          <main className={cn(
            "flex-1 p-6 transition-all duration-300 ease-in-out min-w-0 pt-16",
            !isMobile && sidebarOpen ? "ml-64" : "ml-0"
          )}>
            <div className="m-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="md:inline-flex hidden"
              >
                <PanelLeft className="h-4 w-4  mr-2" />
                {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
              </Button>
            </div>
            {children}
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // For unauthenticated users on protected routes, show loading while redirecting
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default ClientLayout; 