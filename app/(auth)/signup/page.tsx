"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type SignupForm = z.infer<typeof SignupSchema>;

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = SignupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof SignupForm] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      setShowVerificationMessage(true);
      toast({ title: 'Registration successful!', description: 'You have signed up successfully.' });
      router.push("/login");
    } else {
      toast({ title: 'Registration failed', description: data?.error || "Registration failed. Please try again." });
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }), // Only email is needed to resend
    });
    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      toast({ title: 'Verification email resent', description: 'Please check your inbox.' });
    } else {
      toast({ title: 'Failed to resend verification email', description: data?.error || "Failed to resend verification email. Please try again later." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full lg:w-[40vw]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-center">DWTask AMS - FMEA</CardTitle>
          <CardDescription>Sign up for FMEA Management System</CardDescription>
        </CardHeader>
        <CardContent>
          {!showVerificationMessage ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
                {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  placeholder="Enter your email"
                />
                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
              </div>
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
              </div>
              <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter your address"
                />
                {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(value: 'admin' | 'user') => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <div className="text-red-500 text-xs">{errors.role}</div>}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">Don&apos;t have an account?{' '}</span>
                <Link href="/login">
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto">Sign in</Button>
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <h3 className="font-medium">Check Your Email</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We&apos;ve sent a verification email to {form.email}. Please check your inbox and click the verification link to activate your account.
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                <Button
                  onClick={() => setShowVerificationMessage(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Form
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DWTask AMS - FMEA
        </CardFooter>
      </Card>
    </div>
  );
} 
