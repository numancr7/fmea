"use client";
import React from 'react';
import { useSession } from 'next-auth/react'; // Use NextAuth session
import { useRouter } from 'next/navigation'; // Use Next.js router
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/login');
    } else if (requiredRole && (session.user as any).role !== requiredRole) {
      toast.error('You do not have permission to access this page.');
      router.push('/');
    }
  }, [session, status, requiredRole, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) return null;
  if (requiredRole && (session.user as any).role !== requiredRole) return null;

  return <>{children}</>;
};
