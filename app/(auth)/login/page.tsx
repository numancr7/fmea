"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const router = useRouter();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
        toast({ title: 'Email Verified', description: 'Your email has been verified. Please log in.' });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result && !result.error) {
        toast({ title: 'Login successful!', description: 'You have logged in successfully.' });
        if ('token' in result && result.token) {
          localStorage.setItem("token", String(result.token));
        }
        router.push('/');
      } else {
        toast({ title: 'Invalid email or password', description: 'Please check your credentials and try again.' });
        setError("Invalid email or password");
      }
    } catch {
      toast({ title: 'Error', description: 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpRequested(true);
        toast({ title: 'OTP Sent', description: 'Check your email for the OTP.' });
      } else {
        setError(data?.error || 'Failed to send OTP.');
        toast({ title: 'Error', description: data?.error || 'Failed to send OTP.' });
      }
    } catch {
      setError('Failed to send OTP.');
      toast({ title: 'Error', description: 'Failed to send OTP.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Login successful!', description: 'OTP verified. You are now logged in.' });
        // Call NextAuth signIn with a special password for OTP
        await signIn('credentials', {
          email: loginEmail,
          password: 'otp',
          redirect: true,
        });
        // router.push('/'); // No need, signIn will redirect
      } else {
        setError(data?.error || 'Invalid or expired OTP.');
        toast({ title: 'Error', description: data?.error || 'Invalid or expired OTP.' });
      }
    } catch {
      setError('Failed to verify OTP.');
      toast({ title: 'Error', description: 'Failed to verify OTP.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <Card className="w-full lg:w-[40vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-center">DWTask AMS - FMEA</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpMode ? (
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input 
                  id="email"
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input 
                  id="password"
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setOtpMode(true)}>
                Login with OTP
              </Button>
              <div className="text-center mt-2">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline block mb-1">Forgot your password?</a>
                <span className="text-sm text-gray-500">Don&apos;t have an account?{' '}
                  <a href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline">Sign up</a>
                </span>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                <p>Demo credentials:</p>
                <p>Admin: admin@example.com / password</p>
                <p>User: user@example.com / password</p>
              </div>
            </form>
          ) : !otpRequested ? (
            <form onSubmit={handleRequestOtp} className="space-y-4 mt-4">
              <div>
                <label htmlFor="otp-email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="otp-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setOtpMode(false)}>
                Back to Password Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
              <div>
                <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <Input
                  id="otp-code"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setOtpRequested(false)}>
                Back to OTP Request
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DWTask AMS - FMEA
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 
