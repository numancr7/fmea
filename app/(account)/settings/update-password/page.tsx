"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string().min(6, "Confirm new password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const [form, setForm] = useState<UpdatePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePasswordForm, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof UpdatePasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = updatePasswordSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UpdatePasswordForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof UpdatePasswordForm] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({title:"success" , description:"Your password has been updated."});
        setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        // Optionally redirect or just show success
      } else {
        toast({title:"error" , description:data.error || data.message || "An error occurred while updating your password."});
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
                required
                placeholder="Enter your current password"
              />
              {errors.currentPassword && <div className="text-red-500 text-xs">{errors.currentPassword}</div>}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
                placeholder="Enter your new password"
              />
              {errors.newPassword && <div className="text-red-500 text-xs">{errors.newPassword}</div>}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={form.confirmNewPassword}
                onChange={(e) => handleChange("confirmNewPassword", e.target.value)}
                required
                placeholder="Confirm your new password"
              />
              {errors.confirmNewPassword && <div className="text-red-500 text-xs">{errors.confirmNewPassword}</div>}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Updating password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 