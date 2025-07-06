import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { Suspense } from "react";
import Providers from "@/components/Providers";
import ClientLayout from "@/components/layout/ClientLayout";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMEA Management System",
  description: "Failure Mode and Effects Analysis Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <TooltipProvider>
          <Providers>
            <Toaster />
            <Sonner />
            <ClientLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </Suspense>
            </ClientLayout>
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
} 