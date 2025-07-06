"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

const FailureMechanismCreate = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name) {
      toast({ title: 'Error', description: 'Mechanism name is required' });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/failure-mechanisms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create failure mechanism');
      toast({ title: 'Success', description: 'Failure Mechanism Created' });
      router.push('/failure-mechanisms');
    } catch {
      toast({ title: 'Error', description: 'Failed to create failure mechanism' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/failure-mechanisms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Failure Mechanisms
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add Failure Mechanism</h1>
        </div>
        <Card className="max-w-md">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Failure Mechanism Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Mechanism Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Enter mechanism name"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Mechanism'}</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/failure-mechanisms')} disabled={loading}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FailureMechanismCreate; 
