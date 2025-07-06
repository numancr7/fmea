"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-1 sm:py-12 sm:px-4 sm:px-6 lg:px-8 w-full">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            A password reset link has been sent to your email address.
            Please check your inbox (and spam folder) to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the email? Please make sure you entered the correct email address and check your spam folder.
          </p>
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DWTask AMS - FMEA
        </CardFooter>
      </Card>
    </div>
  );
} 
